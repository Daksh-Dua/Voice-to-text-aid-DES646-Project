"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Minus,
  Plus,
  Moon,
  Sun,
  Contrast,
  Type,
  AlignJustify,
  Pause,
  Play,
} from "lucide-react";
import { useAccessibilityStore } from "@/stores/accessibility-store";

export function AccessibilityToolbar() {
  const {
    fontSize,
    setFontSize,
    theme,
    setTheme,
    captionBackground,
    setCaptionBackground,
    lineHeight,
    setLineHeight,
    autoscroll,
    setAutoscroll,
  } = useAccessibilityStore();

  return (
    <div className="flex items-center gap-2 p-2 bg-background border-t flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Font:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFontSize(Math.max(12, fontSize - 2))}
          aria-label="Decrease font size"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm font-mono w-8 text-center">{fontSize}px</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFontSize(Math.min(32, fontSize + 2))}
          aria-label="Increase font size"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Theme:</span>
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("light")}
          aria-label="Light theme"
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("dark")}
          aria-label="Dark theme"
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Button
          variant={theme === "high-contrast" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("high-contrast")}
          aria-label="High contrast theme"
        >
          <Contrast className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          pressed={captionBackground}
          onPressedChange={setCaptionBackground}
          aria-label="Toggle caption background"
        >
          <Type className="h-4 w-4" />
        </Toggle>
        <span className="text-xs text-muted-foreground">BG</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Line:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}
          aria-label="Decrease line height"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm font-mono w-8 text-center">{lineHeight.toFixed(1)}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))}
          aria-label="Increase line height"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          pressed={autoscroll}
          onPressedChange={setAutoscroll}
          aria-label="Toggle autoscroll"
        >
          {autoscroll ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Toggle>
        <span className="text-xs text-muted-foreground">Auto-scroll</span>
      </div>
    </div>
  );
}
