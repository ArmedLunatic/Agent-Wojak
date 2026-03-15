import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#06080f',
        'bg-surface': '#0c1220',
        'bg-elevated': '#131b2e',
        'cyan-primary': '#00d4ff',
        'cyan-muted': '#0a8fb0',
        'orange-accent': '#ff6b35',
        'danger-red': '#ff4444',
        'success-green': '#22c55e',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
