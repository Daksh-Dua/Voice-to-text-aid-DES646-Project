"use client";

import { useState } from "react";
import type { SummaryChunk } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, ChevronDown, ChevronUp } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SummaryPanelProps {
  summaries?: SummaryChunk[];
}

export function SummaryPanel({ summaries = [] }: SummaryPanelProps) {
  const [activeTab, setActiveTab] = useState<"bullet" | "outline" | "paragraph">("bullet");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const copyAll = () => {
    const text = summaries
      .map((s) => {
        if (s.section) return `## ${s.section}\n${s.text}`;
        return s.text;
      })
      .join("\n\n");
    navigator.clipboard.writeText(text);
  };

  const exportMarkdown = () => {
    const md = summaries
      .map((s) => {
        let content = "";
        if (s.section) content += `## ${s.section}\n\n`;
        content += `${s.text}\n\n`;
        if (s.bullets) {
          content += s.bullets.map((b) => `- ${b}`).join("\n") + "\n\n";
        }
        return content;
      })
      .join("");
    
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group summaries by section
  const grouped = summaries.reduce((acc, summary) => {
    const key = summary.section || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(summary);
    return acc;
  }, {} as Record<string, SummaryChunk[]>);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Summary</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAll}
            aria-label="Copy all summaries"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportMarkdown}
            aria-label="Export as Markdown"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="bullet">Bullet</TabsTrigger>
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="paragraph">Paragraph</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="bullet" className="mt-4 space-y-4">
            {Object.entries(grouped).map(([section, chunks]) => (
              <div key={section} className="border rounded-lg p-4">
                <button
                  onClick={() => toggleSection(section)}
                  className="flex items-center justify-between w-full text-left font-semibold mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <span>{section}</span>
                  {expandedSections.has(section) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.has(section) && (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {chunks.flatMap((c) =>
                      c.bullets?.map((bullet, idx) => (
                        <li key={`${c.id}-${idx}`}>{bullet}</li>
                      )) || [<li key={c.id}>{c.text}</li>]
                    )}
                  </ul>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="outline" className="mt-4 space-y-4">
            {Object.entries(grouped).map(([section, chunks]) => (
              <div key={section} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{section}</h3>
                <ul className="space-y-2">
                  {chunks.map((c) => (
                    <li key={c.id} className="text-sm">
                      {formatTime(c.atMs)} - {c.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="paragraph" className="mt-4 space-y-4">
            {summaries.map((summary) => (
              <div key={summary.id} className="border rounded-lg p-4">
                {summary.section && (
                  <h3 className="font-semibold mb-2">{summary.section}</h3>
                )}
                <p className="text-sm">{summary.text}</p>
                <span className="text-xs text-muted-foreground">
                  {formatTime(summary.atMs)}
                </span>
              </div>
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
