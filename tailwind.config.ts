import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        unpopo: {
          yellow: "#FCE14B",
          yellowdeep: "#F6CE2E",
          cream: "#FFF9E6",
          pink: "#FF9DB0",
          pinklight: "#FFE0E6",
          brown: "#B07A4F",
          green: "#7FC243",
          sky: "#A9E4F2",
          ink: "#5A4632",
        },
      },
      fontFamily: {
        rounded: ['"Hiragino Maru Gothic ProN"', '"Zen Maru Gothic"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(176,122,79,0.35)",
        pop: "0 6px 0 0 rgba(0,0,0,0.08)",
      },
      borderRadius: {
        blob: "42% 58% 53% 47% / 48% 42% 58% 52%",
      },
    },
  },
  plugins: [],
};

export default config;
