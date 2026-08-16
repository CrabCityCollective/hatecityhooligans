import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hate City Hooligans",
  description:
    "Beheer je hooligan-gang, bouw beruchtheid op en overleef de politie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
