import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db.server';
import { executions, tasks, agreements } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  
  const db = getDb();
  
  const activeExecs = await db.select({ count: sql<number>`count(*)` }).from(executions).where(eq(executions.status, 'active'));
  const totalValue = await db.select({ sum: sql<number>`COALESCE(SUM(claimValue), 0)` }).from(executions);
  const pendingTasks = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(sql`status != 'completed'`);
  const activeAgreements = await db.select({ count: sql<number>`count(*)` }).from(agreements).where(eq(agreements.status, 'active'));
  const recoveredValue = await db.select({ sum: sql<number>`COALESCE(SUM(agreedValue), 0)` }).from(agreements).where(sql`status IN ('completed', 'active')`);
  
  return NextResponse.json({
    execucoes_ativas: activeExecs[0]?.count || 0,
    valor_carteira: totalValue[0]?.sum || 0,
    tarefas_pendentes: pendingTasks[0]?.count || 0,
    acordos_ativos: activeAgreements[0]?.count || 0,
    valor_recuperado: recoveredValue[0]?.sum || 0,
  });
}
