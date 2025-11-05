"use client";

import { useEffect, useRef, useState } from "react";
import type { Segment } from "@/types";
import { formatTime } from "@/lib/utils";
import { useAccessibilityStore } from "@/stores/accessibility-store";
import { cn } from "@/lib/utils";

interface LiveCaptionProps {
  segments?: Segment[];
  currentTime?: number;
  onSeek?: (time: number) => void;
}

export function LiveCaption({ segments = [], currentTime, onSeek }: LiveCaptionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    fontSize,
    captionBackground,
    lineHeight,
    autoscroll,
    reduceMotion,
  } = useAccessibilityStore();
  const [highlightedWordId, setHighlightedWordId] = useState<string | null>(null);

  // Auto-scroll to bottom when new segments arrive
  useEffect(() => {
    if (autoscroll && containerRef.current && !reduceMotion) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [segments, autoscroll, reduceMotion]);

  // Highlight current word based on time
  useEffect(() => {
    if (currentTime === undefined || !segments) return;

    for (const segment of segments) {
      if (!segment.words) continue;
      for (const word of segment.words) {
        const wordStart = segment.startMs + word.t;
        const wordEnd = wordStart + 500; // Approximate word duration

        if (currentTime >= wordStart && currentTime < wordEnd) {
          setHighlightedWordId(word.id);
          return;
        }
      }
    }
    setHighlightedWordId(null);
  }, [currentTime, segments]);

  const handleTimestampClick = (time: number) => {
    onSeek?.(time);
  };

  return (
    <div
      ref={containerRef}
      aria-live="polite"
      aria-atomic="false"
      className={cn(
        "h-full overflow-y-auto p-4 space-y-3",
        reduceMotion && "scroll-smooth"
      )}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
      }}
    >
      {segments.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Waiting for captions...
        </div>
      ) : (
        segments.map((segment) => (
          <div
            key={segment.id}
            className={cn(
              "flex gap-2 items-start",
              captionBackground && "bg-muted/50 rounded-lg p-3"
            )}
          >
            <button
              onClick={() => handleTimestampClick(segment.startMs)}
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
                "flex-shrink-0 mt-1"
              )}
              aria-label={`Seek to ${formatTime(segment.startMs)}`}
            >
              {formatTime(segment.startMs)}
            </button>
            <div className="flex-1 flex flex-wrap gap-1">
              {segment.words?.map((word, idx) => (
                <span
                  key={word.id}
                  className={cn(
                    "transition-all",
                    highlightedWordId === word.id &&
                      "font-bold text-primary bg-primary/10 rounded px-1"
                  )}
                >
                  {word.w}
                </span>
              )) || <span className="text-muted-foreground">No words in segment</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
