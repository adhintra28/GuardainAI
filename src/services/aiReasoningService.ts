import { ComplianceIssue } from '@/types';
import { openai } from '@/lib/openai';
import { logger } from '@/lib/logger';

export async function explainIssues(issues: ComplianceIssue[]): Promise<ComplianceIssue[]> {
  if (!issues || issues.length === 0) return [];

  const prompt = `You are a compliance auditor. The following issues were found in a shipping/invoice document set.
For each issue, provide a concise explanation (WHY it is a problem and predict consequences like tax rejection/customs delay) and a suggestion on how to fix it.

Return a JSON object with an "explanations" array containing objects with "explanation" and "suggestion" that EXACTLY match the input order.

Input Issues:
${JSON.stringify(issues.map(i => ({ type: i.type, message: i.message })))}

Expected output format:
{
  "explanations": [
    { "explanation": "...", "suggestion": "..." }
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // using mini for faster inline reasoning
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content || '{"explanations": []}';
    const parsed = JSON.parse(content);
    
    if (parsed.explanations && parsed.explanations.length === issues.length) {
      return issues.map((issue, index) => ({
        ...issue,
        explanation: parsed.explanations[index].explanation || 'No explanation provided.',
        suggestion: parsed.explanations[index].suggestion || 'Manual review recommended.'
      }));
    }
  } catch (error) {
    logger.error('AI Reasoning failed to generate analysis', error);
  }

  // Fallback if AI fails or mismatches
  return issues.map(issue => ({
    ...issue,
    explanation: issue.type === 'CRITICAL' ? 'This is a critical compliance failure.' : 'Possible compliance issue.',
    suggestion: 'Review documentation immediately.'
  }));
}
