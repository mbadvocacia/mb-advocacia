'use client';
import { useEffect, useState, useCallback } from 'react';

interface Execucao {
  id: string;
  processNumber: string;
  clientName: string;
  clientDocument: string;
  claimValue: number;
  status: string;
  court: string;
  judge: string;
}

function fmt(v: number) {
  return v ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) : '-';
}

export default function ExecucoesPage() {
  const [rows, setRows] = useState<Execucao[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ processNumber: '', clientName: '', clientDocument: '', claimValue: '', status: 'active', court: '', judge: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/execucoes?page=${page}&search=${encodeURIComponent(search)}`)
      .then(r => r.json())
      .then(d => { setRows(d.data || []); setTotal(d.total || 0); setLoading(false); });
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/execucoes/${editId}` : '/api/execucoes';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setMsg(editId ? 'Atualizado!' : 'Criado!'); setShowForm(false); setEditId(null); setForm({ processNumber: '', clientName: '', clientDocument: '', claimValue: '', status: 'active', court: '', judge: '' }); load(); }
  };

  const handleEdit = (r: Execucao) => {
    setForm({ processNumber: r.processNumber, clientName: r.clientName, clientDocument: r.clientDocument || '', claimValue: String(r.claimValue || ''), status: r.status, court: r.court || '', judge: r.judge || '' });
    setEditId(r.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir execucao?')) return;
    await fetch(`/api/execucoes/${id}`, { method: 'DELETE' });
    setMsg('Removido!'); load();
  };

  const pages = Math.ceil(total / 20);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Execucoes</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Nova</button>
      </div>
      {msg && <div className="mb-3 text-green-600 font-medium">{msg}</div>}
      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por processo, cliente ou documento..." className="w-full border rounded-lg px-3 py-2 mb-4" />
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          <input required placeholder="Numero do Processo" value={form.processNumber} onChange={e => setForm({...form, processNumber: e.target.value})} className="border rounded px-2 py-1" />
          <input required placeholder="Nome do Cliente" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} className="border rounded px-2 py-1" />
          <input placeholder="Documento do Cliente" value={form.clientDocument} onChange={e => setForm({...form, clientDocument: e.target.value})} className="border rounded px-2 py-1" />
          <input placeholder="Valor (R$)" type="number" value={form.claimValue} onChange={e => setForm({...form, claimValue: e.target.value})} className="border rounded px-2 py-1" />
          <input placeholder="Vara/Tribunal" value={form.court} onChange={e => setForm({...form, court: e.target.value})} className="border rounded px-2 py-1" />
          <input placeholder="Juiz" value={form.judge} onChange={e => setForm({...form, judge: e.target.value})} className="border rounded px-2 py-1" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border rounded px-2 py-1">
            <option value="active">Ativo</option>
            <option value="suspended">Suspenso</option>
            <option value="closed">Encerrado</option>
          </select>
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editId ? 'Salvar' : 'Criar'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded-lg">Cancelar</button>
          </div>
        </form>
      )}
      {loading ? <p className="text-gray-400">Carregando...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-100 text-left">{['Processo','Cliente','Documento','Valor','Status','Vara','Juiz','Acoes'].map(h => <th key={h} className="px-3 py-2 border">{h}</th>)}</tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-4 text-center text-gray-400">Nenhuma execucao encontrada</td></tr>}
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 border-b">
                  <td className="px-3 py-2 border font-mono text-xs">{r.processNumber}</td>
                  <td className="px-3 py-2 border">{r.clientName}</td>
                  <td className="px-3 py-2 border text-xs">{r.clientDocument || '-'}</td>
                  <td className="px-3 py-2 border">{fmt(r.claimValue)}</td>
                  <td className="px-3 py-2 border"><span className={`px-2 py-0.5 rounded-full text-xs ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span></td>
                  <td className="px-3 py-2 border">{r.court || '-'}</td>
                  <td className="px-3 py-2 border">{r.judge || '-'}</td>
                  <td className="px-3 py-2 border">
                    <button onClick={() => handleEdit(r)} className="text-blue-600 mr-2 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="flex gap-2 mt-3">
              {Array.from({length: pages}, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
