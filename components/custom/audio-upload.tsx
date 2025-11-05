"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileAudio, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioUploadProps {
  onUploaded?: (fileMeta: { name: string; size: number; type: string }) => void;
}

export function AudioUpload({ onUploaded }: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/webm",
        "audio/ogg",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload audio or video files.");
        return;
      }

      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setError("File size too large. Maximum size is 500MB.");
        return;
      }

      setError(null);
      setIsUploading(true);
      setProgress(0);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Mock API call
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        const fileMeta = { name: file.name, size: file.size, type: file.type };
        onUploaded?.(fileMeta);

        // Navigate to session view after upload completes
        if (data.sessionId) {
          setTimeout(() => {
            router.push(`/library/${data.sessionId}`);
          }, 500);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
        setTimeout(() => setProgress(0), 2000);
      }
    },
    [onUploaded, router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        document.getElementById("file-input")?.click();
      }
    },
    []
  );

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={handleKeyDown}
        aria-label="Upload audio or video file"
        aria-describedby="upload-description"
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-primary/50",
          isUploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          id="file-input"
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileInput}
          className="hidden"
          aria-label="File input"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="space-y-2 w-full max-w-xs">
                <p className="text-sm font-medium">Uploading...</p>
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-xs text-muted-foreground" id="upload-description">
                  or click to browse (MP3, WAV, MP4, WebM)
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum file size: 500MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                Select File
              </Button>
            </>
          )}
        </div>
      </div>
      {error && (
        <div
          role="alert"
          className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3"
        >
          {error}
        </div>
      )}
      {!isUploading && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          Ready to upload
        </div>
      )}
    </div>
  );
}
