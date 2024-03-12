import { useThemeStore } from "~/store";
import useStore from "~/store/useStore";

export default function Switch() {
  const theme = useStore(useThemeStore, (state) => state.theme);
  const changeTheme = useThemeStore((state) => state.changeTheme);

  return (
    <div>
      <button
        onClick={() => {
          changeTheme();
        }}
      >
        <img
          src={theme === "light" ? "/moon.png" : "/sun.png"}
          alt={theme === "light" ? "darkmode" : "lightmode"}
          className={`w-10 md:w-6 transition-opacity duration-500`}
        />
      </button>
    </div>
  );
}
