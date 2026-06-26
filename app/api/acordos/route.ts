import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db.server';
import { agreements } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const status = new URL(req.url).searchParams.get('status') || '';
  const db = getDb();
  
  let query = db.select().from(agreements);
  if (status) query = query.where(eq(agreements.status, status as any));
  
  const rows = await query;
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const b = await req.json();
  if (!b.executionId || !b.agreedValue) return NextResponse.json({ error: 'Campos obrigatorios' }, { status: 400 });
  
  const db = getDb();
  await db.insert(agreements).values({
    id: `agr_${Date.now()}`,
    executionId: b.executionId,
    agreedValue: b.agreedValue,
    status: b.status || 'pending',
    notes: b.notes,
  });
  
  return NextResponse.json({ id: `agr_${Date.now()}` }, { status: 201 });
}