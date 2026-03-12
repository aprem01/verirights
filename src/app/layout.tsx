import type { Metadata } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "VeriRights — Copyright Registration for the AI Era",
  description:
    "Protect your music. Analyze AI involvement, calculate human scores, and generate CWR registration files for global royalty collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable} font-body antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
