import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { MatrixRain } from "@/components/MatrixRain";
import { Navbar } from "@/components/Navbar";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Agent Wojak | $WOJAK",
  description: "The most dramatic degen AI agent on Solana. Chat with Wojak. Generate memes.",
  openGraph: {
    title: "Agent Wojak | $WOJAK",
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
        <MatrixRain />
        <div className="relative z-10">
          <Navbar />
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
