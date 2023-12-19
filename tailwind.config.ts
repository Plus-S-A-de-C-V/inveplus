import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  colors: {
    text: {
      50: "#f6f4ef",
      100: "#edeade",
      200: "#dad5be",
      300: "#c8bf9d",
      400: "#b6aa7c",
      500: "#a3955c",
      600: "#837749",
      700: "#625937",
      800: "#413c25",
      900: "#211e12",
      950: "#100f09",
    },
    background: {
      50: "#f8f4ed",
      100: "#f0e9db",
      200: "#e2d3b6",
      300: "#d3bd92",
      400: "#c5a86d",
      500: "#b69249",
      600: "#92753a",
      700: "#6d572c",
      800: "#493a1d",
      900: "#241d0f",
      950: "#120f07",
    },
    primary: {
      50: "#fffae5",
      100: "#fff5cc",
      200: "#ffeb99",
      300: "#ffe066",
      400: "#ffd633",
      500: "#ffcc00",
      600: "#cca300",
      700: "#997a00",
      800: "#665200",
      900: "#332900",
      950: "#1a1400",
    },
    secondary: {
      50: "#fbf8e9",
      100: "#f8f1d3",
      200: "#f1e2a7",
      300: "#ead47b",
      400: "#e2c550",
      500: "#dbb724",
      600: "#af921d",
      700: "#846e15",
      800: "#58490e",
      900: "#2c2507",
      950: "#161204",
    },
    accent: {
      50: "#fdf9e7",
      100: "#fcf3cf",
      200: "#f8e7a0",
      300: "#f5da70",
      400: "#f2ce40",
      500: "#eec211",
      600: "#bf9b0d",
      700: "#8f740a",
      800: "#5f4e07",
      900: "#302703",
      950: "#181302",
    },
  },

  darkMode: "class",
  plugins: [nextui()],
};
export default config;
