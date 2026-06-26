"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ImportPage() {
  const { data: session, status } = useSession();
  const [isDragging, setIsDragging] = useState(false);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Importar Base de Dados</h2>
          <p className="text-gray-600 mt-1">
            Importe execuções de arquivos CSV ou XLSX
          </p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Arraste seu arquivo aqui
              </p>
              <p className="text-sm text-gray-600 mb-4">
                ou clique para selecionar
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                id="file-upload"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Selecionar Arquivo
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                Formatos aceitos: CSV, XLSX
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Instruções de Importação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Colunas Obrigatórias:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Número do Processo</li>
                <li>Nome do Cliente</li>
                <li>Valor Reclamado</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Colunas Opcionais:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>ID Interno</li>
                <li>Documento do Cliente</li>
                <li>Vara/Tribunal</li>
                <li>Juiz</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Deduplicação:
              </h4>
              <p className="text-sm text-gray-600">
                O sistema detectará duplicatas usando: Número do Processo
                (prioridade 1), ID Interno (prioridade 2) e Nome + Valor
                (prioridade 3).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Imports */}
        <Card>
          <CardHeader>
            <CardTitle>Importações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Nenhuma importação realizada ainda
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
