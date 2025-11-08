import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessibilitySettings } from "@/types";

type AccessibilityStore = AccessibilitySettings & {
  setFontSize: (size: number) => void;
  setTheme: (theme: "light" | "dark" | "high-contrast") => void;
  setCaptionBackground: (enabled: boolean) => void;
  setLineHeight: (height: number) => void;
  setAutoscroll: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  reset: () => void;
};

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  theme: "light",
  captionBackground: true,
  lineHeight: 1.5,
  autoscroll: true,
  reduceMotion: false,
};

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setFontSize: (size) => set({ fontSize: size }),
      setTheme: (theme) => {
        set({ theme });
        // Apply theme class to document
        document.documentElement.className = theme;
      },
      setCaptionBackground: (enabled) => set({ captionBackground: enabled }),
      setLineHeight: (height) => set({ lineHeight: height }),
      setAutoscroll: (enabled) => set({ autoscroll: enabled }),
      setReduceMotion: (enabled) => set({ reduceMotion: enabled }),
      reset: () => set(defaultSettings),
    }),
    {
      name: "accessibility-settings",
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.className = state.theme;
        }
      },
    }
  )
);
