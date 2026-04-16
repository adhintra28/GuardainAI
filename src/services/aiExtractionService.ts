import { Invoice, BillOfLading } from '@/types';
import { openai } from '@/lib/openai';
import { logger } from '@/lib/logger';
import { PDFParse } from 'pdf-parse';

const INVOICE_SCHEMA = `
{
  "invoice_number": "string",
  "invoice_date": "string YYYY-MM-DD",
  "seller_name": "string",
  "seller_gstin": "string",
  "buyer_name": "string",
  "buyer_gstin": "string",
  "items": [
    {
      "description": "string",
      "hsn_code": "string",
      "quantity": "number",
      "unit_price": "number",
      "tax_rate": "number",
      "tax_amount": "number",
      "total_amount": "number"
    }
  ],
  "subtotal": "number",
  "total_tax": "number",
  "grand_total": "number"
}
`;

const BL_SCHEMA = `
{
  "bl_number": "string",
  "shipper": "string",
  "consignee": "string",
  "notify_party": "string",
  "port_of_loading": "string",
  "port_of_discharge": "string",
  "goods": [
    {
      "description": "string",
      "quantity": "number",
      "weight": "number",
      "hs_code": "string"
    }
  ],
  "total_weight": "number",
  "container_number": "string"
}
`;

export async function extractDataFromDocument(
  fileBuffer: Buffer,
  mimeType: string,
  docType: 'invoice' | 'bill_of_lading'
): Promise<Invoice | BillOfLading | null> {
  const schema = docType === 'invoice' ? INVOICE_SCHEMA : BL_SCHEMA;
  const prompt = `You are an expert compliance data extractor. Extract the details from the provided document into the exact JSON schema below.
Ensure dates are output as YYYY-MM-DD. Map numeric values purely to numbers. Nullify missing fields. Do not hallucinate values that are not present.

Return ONLY valid JSON.
Schema:
${schema}
`;

  try {
    let responseText = '';

    if (mimeType === 'application/pdf') {
      // Basic text extraction for PDFs
      const parser = new PDFParse({ data: fileBuffer });
      const textResult = await parser.getText();
      await parser.destroy();
      const textContent = textResult.text;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `Here is the document text: \n\n${textContent}` },
        ],
        response_format: { type: 'json_object' },
      });
      responseText = response.choices[0].message.content || '{}';
    } else if (mimeType.startsWith('image/')) {
      const base64Image = fileBuffer.toString('base64');
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract data from this document.' },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      });
      responseText = response.choices[0].message.content || '{}';
    } else {
      throw new Error(`Unsupported mime type: ${mimeType}`);
    }

    const parsedData = JSON.parse(responseText);
    return parsedData;
  } catch (error) {
    logger.error('Error during AI extraction process', error);
    return null;
  }
}
