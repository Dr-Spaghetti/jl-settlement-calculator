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
          accent: "var(--brand-accent)",
        },
        ground: "var(--page-ground)",
        plg: {
          crimson: "var(--plg-crimson)",
          crimsonDark: "var(--plg-crimson-dark)",
          crimsonLight: "var(--plg-crimson-light)",
          gold: "var(--plg-gold)",
          goldLight: "var(--plg-gold-light)",
          navy: "var(--plg-navy)",
          charcoal: "var(--plg-charcoal)",
          slate: "#334155",
          cream: "var(--page-ground)",
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
          "0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 4px 12px -2px color-mix(in srgb, var(--plg-crimson) 8%, transparent)",
        "plg-glow": "0 0 25px color-mix(in srgb, var(--plg-crimson) 15%, transparent)",
        "plg-panel": "0 20px 40px -10px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
