'use client';
import { useEffect, useState, useCallback } from 'react';

interface Tarefa {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

const cols = ['todo', 'in_progress', 'completed'];
const colLabels: Record<string, string> = { todo: 'A Fazer', in_progress: 'Em Andamento', completed: 'Concluido' };

export default function TarefasPage() {
  const [rows, setRows] = useState<Tarefa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', dueDate: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    fetch('/api/tarefas').then(r => r.json()).then(d => setRows(d.data || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/tarefas/${editId}` : '/api/tarefas';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setMsg(editId ? 'Atualizado!' : 'Criado!'); setShowForm(false); setEditId(null); setForm({ title: '', description: '', status: 'todo', dueDate: '' }); load(); }
  };

  const moveTask = async (t: Tarefa, novoStatus: string) => {
    await fetch(`/api/tarefas/${t.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...t, status: novoStatus}) });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir tarefa?')) return;
    await fetch(`/api/tarefas/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Tarefas (Kanban)</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Nova</button>
      </div>
      {msg && <div className="mb-3 text-green-600 font-medium">{msg}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
          <input required placeholder="Titulo" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border rounded px-2 py-1 col-span-2" />
          <textarea placeholder="Descricao" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border rounded px-2 py-1 col-span-2" rows={2} />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border rounded px-2 py-1">
            <option value="todo">A Fazer</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluido</option>
          </select>
          <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="border rounded px-2 py-1" />
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editId ? 'Salvar' : 'Criar'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded-lg">Cancelar</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-3 gap-4">
        {cols.map(col => (
          <div key={col} className="bg-gray-50 rounded-xl p-3">
            <h2 className="font-semibold text-gray-700 mb-3">{colLabels[col]} <span className="text-xs text-gray-400">({rows.filter(r => r.status === col).length})</span></h2>
            {rows.filter(r => r.status === col).map(t => (
              <div key={t.id} className="bg-white border rounded-lg p-3 mb-2 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-sm text-gray-800">{t.title}</p>
                </div>
                {t.description && <p className="text-xs text-gray-500 mb-2">{t.description}</p>}
                {t.dueDate && <p className="text-xs text-gray-400 mb-2">Vence: {new Date(t.dueDate).toLocaleDateString('pt-BR')}</p>}
                <div className="flex gap-1 flex-wrap">
                  {cols.filter(c => c !== col).map(c => (
                    <button key={c} onClick={() => moveTask(t, c)} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-100">{colLabels[c]}</button>
                  ))}
                  <button onClick={() => handleDelete(t.id)} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded hover:bg-red-100">Excluir</button>
                </div>
              </div>
            ))}
            {rows.filter(r => r.status === col).length === 0 && <p className="text-xs text-gray-400 text-center py-4">Nenhuma tarefa</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
