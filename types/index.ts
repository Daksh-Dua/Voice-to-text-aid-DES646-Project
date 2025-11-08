export type Word = {
  id: string;
  w: string;
  t: number; // ms
};

export type Segment = {
  id: string;
  startMs: number;
  endMs: number;
  words: Word[];
};

export type SummaryChunk = {
  id: string;
  atMs: number;
  text: string;
  bullets?: string[];
  section?: string;
};

export type Session = {
  id: string;
  title: string;
  createdAt: string;
  durationMs?: number;
  source: "upload" | "live";
  segments: Segment[];
  summaries: SummaryChunk[];
  metrics?: {
    avgLatencyMs?: number;
    wer?: number;
    rouge?: {
      r1?: number;
      r2?: number;
      rl?: number;
    };
  };
  tags?: string[];
};

export type FeedbackData = {
  sessionId: string;
  rating: number;
  readability: number;
  comment?: string;
  wouldUse?: boolean;
  device?: string;
  theme?: string;
  fontSize?: number;
};

export type MetricsData = {
  latencyMs: number;
  wordsPerSec: number;
  segmentsPerMin: number;
  tokenUsage?: number;
  connectionStatus: "connected" | "disconnected" | "connecting";
};

export type AccessibilitySettings = {
  fontSize: number;
  theme: "light" | "dark" | "high-contrast";
  captionBackground: boolean;
  lineHeight: number;
  autoscroll: boolean;
  reduceMotion: boolean;
};
