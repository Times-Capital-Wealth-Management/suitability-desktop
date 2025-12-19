import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",   // 👈 required so next-themes works
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;