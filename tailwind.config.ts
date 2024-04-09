import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@aragon/ods/tailwind.config")],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./plugins/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@aragon/ods/**/*.js",
  ],
};
export default config;
