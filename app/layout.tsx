import type { Metadata } from "next";
import ClientLayout from "./layout-client";
import "./globals.css";

export const metadata: Metadata = {
  title: "MB Advocacia - Central de Recuperação de Créditos",
  description: "Sistema de gestão de execuções judiciais e recuperação de créditos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
