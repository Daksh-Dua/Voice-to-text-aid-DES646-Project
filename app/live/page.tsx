"use client";

import { useState, useEffect } from "react";
import { AudioUpload } from "@/components/custom/audio-upload";
import { LiveCaption } from "@/components/custom/live-caption";
import { SummaryPanel } from "@/components/custom/summary-panel";
import { AccessibilityToolbar } from "@/components/custom/accessibility-toolbar";
import { MetricsStrip } from "@/components/custom/metrics-strip";
import type { Segment, SummaryChunk, MetricsData } from "@/types";
import { createMockStream } from "@/lib/mockStream";

export default function LivePage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [summaries, setSummaries] = useState<SummaryChunk[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>({
    latencyMs: 0,
    wordsPerSec: 0,
    segmentsPerMin: 0,
    tokenUsage: 0,
    connectionStatus: "connecting",
  });

  useEffect(() => {
    const stopStream = createMockStream(
      "session-001",
      (segment) => setSegments((prev) => [...prev, segment]),
      (summary) => setSummaries((prev) => [...prev, summary]),
      (data) => setMetrics(data)
    );

    setTimeout(() => setMetrics((m) => ({ ...m, connectionStatus: "connected" })), 1000);
    return stopStream;
  }, []);

  return (
    <main className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-semibold">🎙️ Live Transcription & Summarization</h1>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <MetricsStrip metrics={metrics} />
        <AccessibilityToolbar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden">
        <div className="border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Live Captions</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <LiveCaption segments={segments} />
          </div>
        </div>

        <div className="flex flex-col">
          <SummaryPanel summaries={summaries} />
        </div>
      </div>

      <div className="border-t p-4 bg-background">
        <AudioUpload />
      </div>
    </main>
  );
}
