import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db.server';
import { executions } from '@/db/schema';
import { like, or, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const offset = (page - 1) * limit;

  const db = getDb();
  
  const whereCondition = search 
    ? or(
        like(executions.processNumber, `%${search}%`),
        like(executions.clientName, `%${search}%`),
        like(executions.clientDocument, `%${search}%`)
      )
    : undefined;

  const rows = await db
    .select()
    .from(executions)
    .where(whereCondition)
    .orderBy(desc(executions.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(executions)
    .where(whereCondition);

  const total = countResult[0]?.count || 0;

  return NextResponse.json({ data: rows, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await req.json();
  const { processNumber, clientName, clientDocument, claimValue, court, judge } = body;

  if (!processNumber || !clientName || !claimValue) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
  }

  const db = getDb();
  
  try {
    const newExecution = await db.insert(executions).values({
      id: `exec_${Date.now()}`,
      processNumber,
      clientName,
      clientDocument,
      claimValue: parseFloat(claimValue),
      court,
      judge,
      status: 'active',
    });

    return NextResponse.json(newExecution, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
