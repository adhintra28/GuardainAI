import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrCreateUserIdForScans } from '@/lib/authSession';

export async function GET(_req: Request, ctx: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await ctx.params;
  const userId = await getOrCreateUserIdForScans();

  const job = await db.analysisJob.findFirst({
    where: { id: jobId, userId },
    include: {
      complianceDomain: { select: { id: true, label: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    traceId: job.traceId,
    domain: job.complianceDomain,
    report: job.report,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  });
}
