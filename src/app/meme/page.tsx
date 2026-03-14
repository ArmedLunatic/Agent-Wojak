import { MemeStudio } from "@/components/MemeStudio";

export default function MemePage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold glow mb-2">MEME LAB</h1>
        <p className="text-green-600 text-sm">
          ⟩ describe a scenario. wojak will feel it for you.
        </p>
      </div>
      <MemeStudio />
    </div>
  );
}
