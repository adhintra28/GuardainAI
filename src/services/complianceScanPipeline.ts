import { z } from 'zod';
import { PDFParse } from 'pdf-parse';
import { ensurePdfjsWorkerConfigured } from '@/lib/pdfjsWorker';
import { openai } from '@/lib/openai';
import { logger } from '@/lib/logger';
import type { ComplianceScanReport } from '@/types/complianceScan';

const LlmFindingSchema = z.object({
  actTitle: z.string(),
  status: z.enum(['pass', 'fail', 'unknown']),
  reason: z.string(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

const LlmResponseSchema = z.object({
  findings: z.array(LlmFindingSchema),
  summary: z.string(),
});

const MAX_CHARS = 48_000;

export async function extractTextFromBuffer(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
  const mt = mimeType.toLowerCase();
  if (mt.includes('pdf')) {
    ensurePdfjsWorkerConfigured();
    const parser = new PDFParse({ data: buffer });
    try {
      const data = await parser.getText();
      return data.text ?? '';
    } finally {
      await parser.destroy();
    }
  }
  if (mt.includes('text') || mt === 'application/json' || fileName.endsWith('.md')) {
    return buffer.toString('utf8');
  }
  return buffer.toString('utf8').slice(0, MAX_CHARS);
}

function mergeFindings(
  actTitles: string[],
  llm: z.infer<typeof LlmResponseSchema>,
): z.infer<typeof LlmResponseSchema>['findings'] {
  const byTitle = new Map(llm.findings.map((f) => [f.actTitle.trim().toLowerCase(), f]));
  return actTitles.map((title) => {
    const hit = byTitle.get(title.trim().toLowerCase());
    if (hit) return hit;
    return {
      actTitle: title,
      status: 'unknown' as const,
      reason: 'Not evaluated (model did not return this act).',
    };
  });
}

function scoreFromFindings(findings: { status: string }[]): { score: number; risk: string } {
  if (findings.length === 0) return { score: 0, risk: 'HIGH' };
  const passCount = findings.filter((f) => f.status === 'pass').length;
  const failCount = findings.filter((f) => f.status === 'fail').length;
  /**
   * Proportional score: each control adds 1/n only if `pass`.
   * `fail` (wrong / non-compliant) and `unknown` add 0 for that slot → 100 only when all pass.
   */
  const score = Math.round((passCount / findings.length) * 100);
  let risk: string;
  if (passCount === findings.length) risk = 'LOW';
  else if (failCount > 1) risk = 'HIGH';
  else if (failCount === 1) risk = 'MEDIUM';
  else if (passCount === 0) risk = 'HIGH';
  else if (score >= 80) risk = 'LOW';
  else risk = 'MEDIUM';
  return { score, risk };
}

export async function runComplianceScanPipeline(input: {
  traceId: string;
  domainId: string;
  domainLabel: string;
  actTitles: string[];
  documents: { fileName: string; mimeType: string; text: string }[];
}): Promise<ComplianceScanReport> {
  const combined = input.documents
    .map((d) => `--- File: ${d.fileName} (${d.mimeType}) ---\n${d.text}`)
    .join('\n\n')
    .slice(0, MAX_CHARS);

  const combinedTrimmed = combined.trim();
  if (combinedTrimmed.length < 10) {
    const findings = input.actTitles.map((actTitle) => ({
      actTitle,
      status: 'fail' as const,
      reason: 'No usable text extracted from the uploaded documents.',
    }));
    const { score, risk } = scoreFromFindings(findings);
    return {
      compliance_score: score,
      risk_level: risk,
      summary: 'Could not extract enough text from the files to assess compliance.',
      domainId: input.domainId,
      domainLabel: input.domainLabel,
      findings,
    };
  }

  const actsList = input.actTitles.map((t, i) => `${i + 1}. ${t}`).join('\n');

  const system = `You are a compliance analyst. Given document text and a target industry domain, evaluate evidence for each listed compliance area.
Respond with JSON only (no markdown) matching this shape:
{"findings":[{"actTitle":string,"status":"pass"|"fail"|"unknown","reason":string,"severity":"low"|"medium"|"high"(optional)}],"summary":string}
Rules:
- actTitle must match one of the provided compliance areas exactly (same string).
- pass = the documents clearly contain supporting evidence for that specific compliance area.
- fail = use fail when: (1) there is a clear violation or missing required evidence, OR (2) the documents are unrelated to the domain, off-topic, or do not address that compliance area at all. Wrong or irrelevant documents must be fail, not unknown.
- unknown = ONLY when the text is too garbled, empty, or ambiguous to tell — not when the topic simply does not match.
- Keep reasons concise (1-3 sentences).`;

  const user = `Domain: ${input.domainLabel} (${input.domainId})

Compliance areas (evaluate each):
${actsList}

Document content:
${combined}`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'dummy_build_key') {
    logger.warn('OPENAI_API_KEY missing; returning heuristic unknown findings');
    const findings = input.actTitles.map((actTitle) => ({
      actTitle,
      status: 'unknown' as const,
      reason: 'OpenAI is not configured. Add OPENAI_API_KEY to enable analysis.',
    }));
    const { score, risk } = scoreFromFindings(findings);
    return {
      compliance_score: score,
      risk_level: risk,
      summary: 'Analysis skipped: OpenAI API key not configured.',
      domainId: input.domainId,
      domainLabel: input.domainLabel,
      findings,
    };
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_COMPLIANCE_MODEL ?? 'gpt-4o-mini',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const decoded = LlmResponseSchema.safeParse(parsed);
  if (!decoded.success) {
    logger.error('LLM JSON parse failed', { traceId: input.traceId, issues: decoded.error.issues });
    const findings = input.actTitles.map((actTitle) => ({
      actTitle,
      status: 'unknown' as const,
      reason: 'Could not parse model output.',
    }));
    const { score, risk } = scoreFromFindings(findings);
    return {
      compliance_score: score,
      risk_level: risk,
      summary: 'Analysis completed with parsing errors; review raw documents.',
      domainId: input.domainId,
      domainLabel: input.domainLabel,
      findings,
    };
  }

  const findings = mergeFindings(input.actTitles, decoded.data);
  const { score, risk } = scoreFromFindings(findings);

  return {
    compliance_score: score,
    risk_level: risk,
    summary: decoded.data.summary,
    domainId: input.domainId,
    domainLabel: input.domainLabel,
    findings,
  };
}
