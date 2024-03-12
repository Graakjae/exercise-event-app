import { useThemeStore } from "~/store";
import useStore from "~/store/useStore";

export default function ThemeProvider({ children }) {
  const theme = useStore(useThemeStore, (state) => state.theme);

  return (
    <body
      className={`transition-colors ${theme === "light" ? "bg-[#f4f4f4] text-black" : "bg-[#101010] text-white"}`}
    >
      {children}
    </body>
  );
}
