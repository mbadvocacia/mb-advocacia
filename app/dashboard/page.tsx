'use client';
import { useEffect, useState } from 'react';

interface KPIs {
  execucoes_ativas: number;
  valor_carteira: number;
  tarefas_pendentes: number;
  acordos_ativos: number;
  valor_recuperado: number;
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setKpis(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Carregando KPIs...</div>;
  if (!kpis) return <div className="p-8 text-red-500">Erro ao carregar dados.</div>;

  const cards = [
    { label: 'Execucoes Ativas', value: kpis.execucoes_ativas, isMoney: false, color: 'bg-blue-50 border-blue-200' },
    { label: 'Valor da Carteira', value: kpis.valor_carteira, isMoney: true, color: 'bg-green-50 border-green-200' },
    { label: 'Tarefas Pendentes', value: kpis.tarefas_pendentes, isMoney: false, color: 'bg-yellow-50 border-yellow-200' },
    { label: 'Acordos Ativos', value: kpis.acordos_ativos, isMoney: false, color: 'bg-purple-50 border-purple-200' },
    { label: 'Valor Recuperado', value: kpis.valor_recuperado, isMoney: true, color: 'bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.label} className={`border rounded-xl p-5 ${c.color}`}>
            <p className="text-sm text-gray-500 mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-gray-800">
              {c.isMoney ? fmt(Number(c.value)) : c.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
