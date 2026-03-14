import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-green-900 py-4 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold glow glitch">
          AGENT WOJAK
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            [CHAT]
          </Link>
          <Link href="/meme" className="hover:text-white transition-colors">
            [MEME LAB]
          </Link>
          <Link href="/gallery" className="hover:text-white transition-colors">
            [GALLERY]
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            [TOKEN]
          </Link>
        </div>
      </div>
    </nav>
  );
}
