"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TasksPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  const kanbanColumns = [
    { id: "todo", title: "A Fazer", color: "bg-gray-100" },
    { id: "in_progress", title: "Em Andamento", color: "bg-blue-100" },
    { id: "completed", title: "Concluído", color: "bg-green-100" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarefas</h2>
            <p className="text-gray-600 mt-1">Gerenciamento de tarefas por execução</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kanbanColumns.map((column) => (
            <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-96`}>
              <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                  Nenhuma tarefa
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
