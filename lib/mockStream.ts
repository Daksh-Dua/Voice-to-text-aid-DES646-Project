import type { Segment, SummaryChunk, MetricsData } from "@/types";

const SAMPLE_WORDS = [
  "the",
  "lecture",
  "today",
  "covers",
  "machine",
  "learning",
  "fundamentals",
  "we",
  "will",
  "discuss",
  "neural",
  "networks",
  "and",
  "deep",
  "learning",
  "architectures",
  "this",
  "includes",
  "convolutional",
  "neural",
  "networks",
  "recurrent",
  "neural",
  "networks",
  "and",
  "transformers",
  "let",
  "us",
  "start",
  "with",
  "the",
  "basics",
];

const SAMPLE_SUMMARIES = [
  {
    text: "Introduction to machine learning and neural networks",
    bullets: [
      "Overview of ML fundamentals",
      "Neural network architecture basics",
      "Applications in modern AI",
    ],
    section: "Introduction",
  },
  {
    text: "Deep learning architectures and their applications",
    bullets: [
      "CNN for image processing",
      "RNN for sequence data",
      "Transformers for NLP",
    ],
    section: "Architectures",
  },
  {
    text: "Practical implementations and use cases",
    bullets: ["Training procedures", "Evaluation metrics", "Real-world examples"],
    section: "Implementation",
  },
];

let wordIndex = 0;
let segmentId = 0;
let summaryId = 0;
let startTime = Date.now();

function generateLatency(): number {
  return 80 + Math.random() * 140; // 80-220ms
}

function generateSegment(): Segment {
  const now = Date.now();
  const startMs = now - startTime - 1000;
  const endMs = now - startTime;
  const wordCount = 3 + Math.floor(Math.random() * 5);
  const words = [];

  for (let i = 0; i < wordCount; i++) {
    words.push({
      id: `w-${segmentId}-${i}`,
      w: SAMPLE_WORDS[wordIndex % SAMPLE_WORDS.length],
      t: startMs + (i * (endMs - startMs)) / wordCount,
    });
    wordIndex++;
  }

  segmentId++;
  return {
    id: `seg-${segmentId}`,
    startMs,
    endMs,
    words,
  };
}

function generateSummaryChunk(): SummaryChunk {
  const summary = SAMPLE_SUMMARIES[summaryId % SAMPLE_SUMMARIES.length];
  summaryId++;

  return {
    id: `sum-${summaryId}`,
    atMs: Date.now() - startTime,
    text: summary.text,
    bullets: summary.bullets,
    section: summary.section,
  };
}

export function createMockStream(
  sessionId: string,
  onCaption: (segment: Segment) => void,
  onSummary: (chunk: SummaryChunk) => void,
  onMetrics: (metrics: MetricsData) => void
): () => void {
  let isRunning = true;
  let segmentInterval: NodeJS.Timeout;
  let summaryInterval: NodeJS.Timeout;
  let metricsInterval: NodeJS.Timeout;
  let wordsEmitted = 0;
  const segmentStartTime = Date.now();

  // Emit segments every 1-3 seconds
  segmentInterval = setInterval(() => {
    if (!isRunning) return;
    const segment = generateSegment();
    wordsEmitted += segment.words.length;

    setTimeout(() => {
      if (isRunning) {
        onCaption(segment);
      }
    }, generateLatency());
  }, 1000 + Math.random() * 2000);

  // Emit summaries every 10-15 seconds
  summaryInterval = setInterval(() => {
    if (!isRunning) return;

    setTimeout(() => {
      if (isRunning) {
        onSummary(generateSummaryChunk());
      }
    }, generateLatency());
  }, 10000 + Math.random() * 5000);

  // Emit metrics every second
  metricsInterval = setInterval(() => {
    if (!isRunning) return;

    const elapsed = (Date.now() - segmentStartTime) / 1000;
    const wordsPerSec = elapsed > 0 ? wordsEmitted / elapsed : 0;
    const segmentsPerMin = (segmentId / elapsed) * 60;

    onMetrics({
      latencyMs: generateLatency(),
      wordsPerSec,
      segmentsPerMin,
      tokenUsage: wordsEmitted * 1.3, // rough estimate
      connectionStatus: "connected",
    });
  }, 1000);

  // Cleanup function
  return () => {
    isRunning = false;
    clearInterval(segmentInterval);
    clearInterval(summaryInterval);
    clearInterval(metricsInterval);
  };
}
