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
        brand: {
          DEFAULT: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
        },
        ground: "#F9F8F6",
        plg: {
          crimson: "#8C1D24",
          crimsonDark: "#6F141A",
          crimsonLight: "#AB232C",
          gold: "#C5A880",
          goldLight: "#E8DEC8",
          navy: "#0F172A",
          charcoal: "#1E293B",
          slate: "#334155",
          cream: "#F9F8F6",
          warmIvory: "#F4F1EA",
          borderMuted: "#E5DFD5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        cinzel: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        card: "0 8px 32px -8px rgba(15, 23, 42, 0.12)",
        "plg-card":
          "0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(140, 29, 36, 0.04)",
        "plg-glow": "0 0 25px rgba(140, 29, 36, 0.15)",
        "plg-panel": "0 20px 40px -10px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
