const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const WIDTH = 600;
const HEIGHT = 600;

const templates = [
  { name: "crying", bg: "#1a1a2e", emoji: "😢", label: "CRYING WOJAK", color: "#4a90d9" },
  { name: "chad", bg: "#1a2e1a", emoji: "💪", label: "CHAD WOJAK", color: "#00FF41" },
  { name: "doomer", bg: "#0d0d0d", emoji: "🚬", label: "DOOMER WOJAK", color: "#666666" },
  { name: "bloomer", bg: "#1a2e1a", emoji: "🌸", label: "BLOOMER WOJAK", color: "#ff69b4" },
  { name: "pink", bg: "#2e1a1a", emoji: "😱", label: "PINK WOJAK", color: "#ff4444" },
  { name: "smug", bg: "#2e2e1a", emoji: "😏", label: "SMUG WOJAK", color: "#ffcc00" },
  { name: "brain", bg: "#1a1a2e", emoji: "🧠", label: "BRAIN WOJAK", color: "#9b59b6" },
  { name: "npc", bg: "#1a1a1a", emoji: "🤖", label: "NPC WOJAK", color: "#888888" },
  { name: "cozy", bg: "#2e1a0d", emoji: "☕", label: "COZY WOJAK", color: "#ff8c00" },
  { name: "pointing", bg: "#1a2e2e", emoji: "👉", label: "POINTING WOJAK", color: "#00cccc" },
];

const outputDir = path.join(__dirname, "..", "public", "templates");

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const t of templates) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Grid/matrix lines for aesthetic
  ctx.strokeStyle = t.color + "15";
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  // Circle face
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2 - 20, 120, 0, Math.PI * 2);
  ctx.fillStyle = t.color + "20";
  ctx.fill();
  ctx.strokeStyle = t.color + "60";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Emoji (as text - won't render perfectly but gives the idea)
  ctx.font = "80px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(t.emoji, WIDTH / 2, HEIGHT / 2 - 20);

  // Label
  ctx.font = "bold 28px monospace";
  ctx.fillStyle = t.color;
  ctx.textAlign = "center";
  ctx.fillText(t.label, WIDTH / 2, HEIGHT - 80);

  // Border
  ctx.strokeStyle = t.color + "40";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);

  // Save
  const buffer = canvas.toBuffer("image/png");
  const filePath = path.join(outputDir, `${t.name}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created: ${t.name}.png`);
}

console.log("All templates generated!");
