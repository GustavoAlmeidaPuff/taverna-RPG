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
        // Primary
        primary: "#e8b430",
        "primary-text": "#120f0d",
        // Secondary
        secondary: "#32241b",
        "secondary-text": "#ebe8e0",
        // Accent
        accent: "#c37322",
        "accent-text": "#f5f4f0",
        // Base
        background: "#120f0d",
        text: "#ebe8e0",
        // Card
        card: "#1d1816",
        "card-text": "#ebe8e0",
        // Popover
        popover: "#171311",
        "popover-text": "#ebe8e0",
        // Muted
        muted: "#322c29",
        "muted-text": "#989281",
        // Destructive
        destructive: "#d92626",
        "destructive-text": "#f5f4f0",
        // Border & Input
        border: "#3d3329",
        input: "#2c2421",
        "focus-ring": "#e8b430",
      },
    },
  },
  plugins: [],
};
export default config;
