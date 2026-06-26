import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db.server';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const status = new URL(req.url).searchParams.get('status') || '';
  const db = getDb();
  
  let query = db.select().from(tasks);
  if (status) query = query.where(eq(tasks.status, status as any));
  
  const rows = await query;
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const b = await req.json();
  if (!b.title) return NextResponse.json({ error: 'Titulo obrigatorio' }, { status: 400 });
  
  const db = getDb();
  await db.insert(tasks).values({
    id: `task_${Date.now()}`,
    executionId: b.executionId || '',
    title: b.title,
    description: b.description,
    status: b.status || 'todo',
    dueDate: b.dueDate,
  });
  
  return NextResponse.json({ id: `task_${Date.now()}` }, { status: 201 });
}