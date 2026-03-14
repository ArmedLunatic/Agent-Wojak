import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { MatrixRain } from "@/components/MatrixRain";
import { Navbar } from "@/components/Navbar";
import { BootSequence } from "@/components/BootSequence";
import { WalletProvider } from "@/components/WalletProvider";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
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
    <html lang="en" className={shareTechMono.variable}>
      <body className="bg-black text-green-400 font-mono min-h-screen relative overflow-x-hidden">
        <WalletProvider>
          <BootSequence />
          <MatrixRain />
          <div className="relative z-10">
            <Navbar />
            <main className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
              {children}
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
