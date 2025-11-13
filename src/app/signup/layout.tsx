import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Cuenta - TuringStore",
  description: "Crea tu cuenta en TuringStore y disfruta de ofertas exclusivas, envío rápido y una experiencia de compra personalizada.",
  openGraph: {
    title: "Crear Cuenta - TuringStore",
    description: "Únete a TuringStore y comienza a comprar hoy mismo.",
    type: "website",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
