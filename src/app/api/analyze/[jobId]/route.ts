import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAccessTokenFromRequest, verifyAccessToken } from '@/lib/auth';
import { db } from '@/lib/db';

type AnalyzeJobRouteContext = {
  params: Promise<{ jobId: string }>;
};

type AnalysisJobRow = {
  id: string;
  userId: string;
  status: string;
  report: Prisma.JsonValue | null;
  errorMessage: string | null;
};

export async function GET(req: NextRequest, ctx: AnalyzeJobRouteContext) {
  const token = getAccessTokenFromRequest(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  let userId: string;
  try {
    userId = verifyAccessToken(token).sub;
  } catch {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { jobId } = await ctx.params;
  const [job] = await db.$queryRaw<AnalysisJobRow[]>(Prisma.sql`
    SELECT id, "userId", status, report, "errorMessage"
    FROM "AnalysisJob"
    WHERE id = ${jobId}
    LIMIT 1
  `);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (job.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (job.status === 'FAILED') {
    return NextResponse.json(
      {
        jobId: job.id,
        status: job.status,
        error: job.errorMessage ?? 'Analysis failed',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    jobId: job.id,
    status: job.status,
    report: job.report,
  });
}
