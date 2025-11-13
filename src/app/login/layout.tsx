import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión - TuringStore",
  description: "Inicia sesión en TuringStore para acceder a tu cuenta, ver tus pedidos y gestionar tu perfil.",
  openGraph: {
    title: "Iniciar Sesión - TuringStore",
    description: "Inicia sesión en TuringStore para acceder a tu cuenta.",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
