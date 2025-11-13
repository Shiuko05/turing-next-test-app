import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Administración - TuringStore",
  description: "Panel de administración para gestionar productos, pedidos y usuarios de TuringStore.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
