import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirma tu Email - TuringStore",
  description: "Verifica tu correo electrónico para completar el registro en TuringStore y comenzar a comprar.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConfirmEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
