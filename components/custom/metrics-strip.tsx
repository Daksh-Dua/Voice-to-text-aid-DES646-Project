"use client";

import type { MetricsData } from "@/types";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsStripProps {
  metrics: MetricsData;
}

export function MetricsStrip({ metrics }: MetricsStripProps) {
  const { latencyMs, wordsPerSec, segmentsPerMin, connectionStatus } = metrics;

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "connecting":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-500";
      case "connecting":
        return "text-yellow-500";
      case "disconnected":
        return "text-red-500";
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-lg text-sm">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={cn("font-medium", getStatusColor())}>
          {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Latency:</span>
        <span className="font-mono">{Math.round(latencyMs)}ms</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Words/sec:</span>
        <span className="font-mono">{wordsPerSec.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Segments/min:</span>
        <span className="font-mono">{Math.round(segmentsPerMin)}</span>
      </div>
    </div>
  );
}
