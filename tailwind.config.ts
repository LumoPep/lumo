import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1814",
        bone: "#F5EFE4",
        cream: "#EBE2CF",
        clay: "#B8624A",
        ochre: "#C89A3C",
        sage: "#6D7A5C",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        editorial: ["var(--font-newsreader)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        functional: ["var(--font-inter-tight)", "sans-serif"],
      },
      letterSpacing: {
        mono: "0.03em",
        display: "-0.035em",
      },
      lineHeight: {
        editorial: "1.55",
      },
    },
  },
  plugins: [],
};
export default config;
