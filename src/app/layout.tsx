import type { Metadata } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BootSequence } from "@/components/BootSequence";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Agent Wojak | $AgentJak",
  description: "The most dramatic degen AI agent on Solana. Chat with Wojak. Generate memes.",
  openGraph: {
    title: "Agent Wojak | $AgentJak",
    description: "The most dramatic degen AI agent on Solana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-deep text-[rgba(255,255,255,0.92)] font-body min-h-screen relative overflow-x-hidden">
        <BootSequence />
        <Navbar />
        <main className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
