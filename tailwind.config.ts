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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          yellow: "hsl(var(--accent-yellow))",
        },
        slate: {
          900: "#1e293b", // Slate 900
        },
        // Identidad DL (manual de logomarca)
        resalte: "#FBE200",
        grafito: "#000306",
        grafito2: "#14181C",
        celeste: "#4FB3E8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Arial Narrow", "Arial", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Aparición del globo explicativo de los chips (no usamos tailwindcss-animate)
      keyframes: {
        globo: {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        globo: "globo 0.14s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
