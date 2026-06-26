import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db.server';
import { agreements } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const db = getDb();
  const rows = await db.select().from(agreements).where(eq(agreements.id, id));
  if (!rows.length) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const b = await req.json();
  const db = getDb();
  await db.update(agreements).set({
    agreedValue: b.agreedValue,
    status: b.status,
    notes: b.notes,
  }).where(eq(agreements.id, id));
  
  return NextResponse.json({ message: 'Atualizado' });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const db = getDb();
  await db.delete(agreements).where(eq(agreements.id, id));
  return NextResponse.json({ message: 'Removido' });
}
