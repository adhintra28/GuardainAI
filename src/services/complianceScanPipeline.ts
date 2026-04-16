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
  let points = 0;
  for (const f of findings) {
    if (f.status === 'pass') points += 1;
    else if (f.status === 'unknown') points += 0.5;
  }
  const score = Math.round((points / findings.length) * 100);
  const failCount = findings.filter((f) => f.status === 'fail').length;
  const risk = failCount > 1 ? 'HIGH' : failCount === 1 ? 'MEDIUM' : score >= 80 ? 'LOW' : 'MEDIUM';
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

  const actsList = input.actTitles.map((t, i) => `${i + 1}. ${t}`).join('\n');

  const system = `You are a compliance analyst. Given document text and a target industry domain, evaluate evidence for each listed compliance area.
Respond with JSON only (no markdown) matching this shape:
{"findings":[{"actTitle":string,"status":"pass"|"fail"|"unknown","reason":string,"severity":"low"|"medium"|"high"(optional)}],"summary":string}
Rules:
- actTitle must match one of the provided compliance areas exactly (same string).
- pass = clear supporting evidence in the documents; fail = clear violation or missing required evidence; unknown = insufficient text to decide.
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
