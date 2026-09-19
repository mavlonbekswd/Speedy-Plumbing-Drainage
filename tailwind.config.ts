import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      colors: {
        // Deep navy brand with a confident blue secondary and a high-visibility
        // yellow call to action, on a warm-neutral ground.
        brand: { DEFAULT: "#10296B", 2: "#0B1F52" },
        tint:  { DEFAULT: "#2F5BD8", bright: "#8FB0FF", soft: "#E7EDFB" },
        cta:   { DEFAULT: "#FFC233", deep: "#E5A800" },
        paper: { DEFAULT: "#F7F7F4", 2: "#EEF1F5" },
        ink:      "#0B1730",
        slate:    "#3A4A66",
        steel:    "#52627D",
        line:     "#DCE3EE",
        white:    "#FFFFFF",
        whatsapp: "#25D366",
      },
      borderRadius: {
        card: "1.25rem",
        chip: "0.75rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,23,48,.04), 0 10px 30px rgba(16,41,107,.08)",
        lift: "0 18px 40px rgba(16,41,107,.14)",
        dark: "0 24px 60px rgba(5,12,32,.35)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up":   "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-1": "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        "fade-up-2": "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both",
      },
    },
  },
  plugins: [],
};

export default config;
