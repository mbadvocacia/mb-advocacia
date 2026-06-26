import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db.server';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const b = await req.json();
  const db = getDb();
  await db.update(tasks).set({
    title: b.title,
    description: b.description,
    status: b.status,
    dueDate: b.dueDate,
  }).where(eq(tasks.id, id));
  
  return NextResponse.json({ message: 'Atualizado' });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const db = getDb();
  await db.delete(tasks).where(eq(tasks.id, id));
  return NextResponse.json({ message: 'Removido' });
}
