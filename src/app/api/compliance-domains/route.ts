import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const rows = await db.complianceDomain.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        acts: {
          orderBy: { sortOrder: 'asc' },
          select: { title: true },
        },
      },
    });

    const body = rows.map((r) => ({
      id: r.id,
      label: r.label,
      compliances: r.acts.map((a) => a.title),
    }));

    return NextResponse.json(body);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to load compliance domains. Run: npx prisma db push && npm run db:seed' },
      { status: 503 },
    );
  }
}
