import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: "Komet - Explora nuestro vecindario galáctico",
  description: "Descubre los misterios del espacio con Komet. Una experiencia interactiva para explorar planetas, estrellas y objetos celestes de nuestro sistema solar y más allá.",
  keywords: ["astronomía", "espacio", "planetas", "sistema solar", "galaxia", "exploración espacial"],
  authors: [{ name: "Komet Team" }],
  creator: "Komet",
  publisher: "Komet",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Komet - Explora nuestro vecindario galáctico",
    description: "Descubre los misterios del espacio con Komet. Una experiencia interactiva para explorar planetas, estrellas y objetos celestes.",
    type: "website",
    locale: "es_ES",
    siteName: "Komet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Komet - Explora nuestro vecindario galáctico",
    description: "Descubre los misterios del espacio con Komet.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={orbitron.variable}>
      <body className="font-orbitron antialiased">{children}</body>
    </html>
  );
}
