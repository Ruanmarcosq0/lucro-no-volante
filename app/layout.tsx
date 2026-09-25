import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucro no Volante",
  description: "Saiba quanto sobra de verdade depois dos custos do carro.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#11251f", borderRadius: "0.9rem" } }}>
      <html lang="pt-BR"><body className="antialiased">{children}</body></html>
    </ClerkProvider>
  );
}
