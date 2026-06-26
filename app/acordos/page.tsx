'use client';
import { useEffect, useState, useCallback } from 'react';

interface Acordo {
  id: string;
  executionId: string;
  agreedValue: number;
  status: string;
  notes: string;
}

function fmt(v: number) {
  return v ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) : '-';
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AcordosPage() {
  const [rows, setRows] = useState<Acordo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ executionId: '', agreedValue: '', status: 'pending', notes: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    fetch('/api/acordos').then(r => r.json()).then(d => setRows(d.data || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/acordos/${editId}` : '/api/acordos';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setMsg(editId ? 'Atualizado!' : 'Criado!'); setShowForm(false); setEditId(null); setForm({ executionId: '', agreedValue: '', status: 'pending', notes: '' }); load(); }
  };

  const handleEdit = (r: Acordo) => {
    setForm({ executionId: r.executionId, agreedValue: String(r.agreedValue || ''), status: r.status, notes: r.notes || '' });
    setEditId(r.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir acordo?')) return;
    await fetch(`/api/acordos/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Acordos</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Novo</button>
      </div>
      {msg && <div className="mb-3 text-green-600 font-medium">{msg}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          <input required placeholder="ID da Execucao" value={form.executionId} onChange={e => setForm({...form, executionId: e.target.value})} className="border rounded px-2 py-1" />
          <input required placeholder="Valor Acordado (R$)" type="number" value={form.agreedValue} onChange={e => setForm({...form, agreedValue: e.target.value})} className="border rounded px-2 py-1" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border rounded px-2 py-1">
            <option value="pending">Pendente</option>
            <option value="active">Ativo</option>
            <option value="completed">Concluido</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <textarea placeholder="Observacoes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="border rounded px-2 py-1 col-span-2" rows={2} />
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editId ? 'Salvar' : 'Criar'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded-lg">Cancelar</button>
          </div>
        </form>
      )}
      {rows.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Nenhum acordo registrado</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-100 text-left">{['ID Exec','Valor Acordado','Status','Observacoes','Acoes'].map(h => <th key={h} className="px-3 py-2 border">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 border-b">
                  <td className="px-3 py-2 border font-mono text-xs">{r.executionId}</td>
                  <td className="px-3 py-2 border">{fmt(r.agreedValue)}</td>
                  <td className="px-3 py-2 border"><span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[r.status] || 'bg-gray-100'}`}>{r.status}</span></td>
                  <td className="px-3 py-2 border text-xs">{r.notes || '-'}</td>
                  <td className="px-3 py-2 border">
                    <button onClick={() => handleEdit(r)} className="text-blue-600 mr-2 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
