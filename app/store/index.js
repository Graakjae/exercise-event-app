import { persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

export const useThemeStore = createWithEqualityFn()(
  persist(
    (set, get) => ({
      theme: "light",
      changeTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    {
      name: "theme-storage",
    },
  ),
);
