import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dentova: {
          navy: {
            50: "#f4f3fa",
            100: "#e8e6f4",
            200: "#d1cde8",
            300: "#b0a5d4",
            400: "#8976c4",
            500: "#6c5aab",
            600: "#574691",
            700: "#453775",
            800: "#322a5c",
            900: "#201c45",
            950: "#14123a"
          },
          teal: {
            50: "#eefafb",
            100: "#d9f3f7",
            200: "#b8e8f0",
            300: "#8fd9e8",
            400: "#73cbe9",
            500: "#73cbd5",
            600: "#4fb3c0",
            700: "#3d96a3",
            800: "#357986",
            900: "#30646f",
            950: "#202063"
          },
          violet: "#321246",
          purple: "#3c348a",
          lavender: "#8976c4",
          magenta: {
            DEFAULT: "#9817a0",
            50: "#fdf2fd",
            100: "#fae4fb",
            200: "#f3c8f5",
            300: "#e99cef",
            400: "#d965e0",
            500: "#9817a0",
            600: "#a414ad",
            700: "#7d1285",
            800: "#68126d",
            900: "#56155a",
            950: "#3a073d"
          },
          cyan: "#73cbd5",
          ice: "#f4f3fa",
          ink: "#14123a",
          canvas: "#f4f3fa",
          surface: "#ffffff",
          ash: "#e8e6f4",
          graphite: "#14123a",
          muted: "#574691",
          coral: "#9817a0",
          gold: "#e99cef",
          mint: "#eefafb"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: [
          "var(--font-darker-grotesque)",
          "var(--font-inter)",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(20, 18, 58, 0.12)",
        card: "0 14px 30px rgba(20, 18, 58, 0.10)",
        luxe: "0 24px 70px rgba(20, 18, 58, 0.16)",
        glow: "0 18px 45px rgba(152, 23, 160, 0.28)"
      },
      backgroundImage: {
        "dentova-gradient":
          "linear-gradient(135deg, #14123a 0%, #321246 52%, #202063 100%)",
        "dentova-aurora":
          "linear-gradient(135deg, rgba(115, 203, 213, 0.22), rgba(20, 18, 58, 0.18) 48%, rgba(137, 118, 196, 0.18))",
        "dentova-cta":
          "linear-gradient(135deg, #9817a0 0%, #a414ad 48%, #8976c4 100%)"
      }
    }
  },
  plugins: []
};

export default config;
