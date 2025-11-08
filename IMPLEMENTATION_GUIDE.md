# Implementation Guide

This document lists all files that need to be created for the complete application.

## Completed Files ✓

- Configuration: package.json, tsconfig.json, tailwind.config.ts, next.config.mjs, .eslintrc.json, .prettierrc
- Types: types/index.ts
- Utilities: lib/utils.ts, lib/algorithms.ts, lib/mockStream.ts
- Stores: stores/accessibility-store.ts
- UI Components: components/ui/button.tsx, components/ui/card.tsx, components/ui/tabs.tsx, components/ui/dialog.tsx, components/ui/progress.tsx, components/ui/toggle.tsx
- App Structure: app/layout.tsx, app/providers.tsx, app/globals.css, app/page.tsx
- Custom Components: components/custom/audio-upload.tsx
- API: app/api/upload/route.ts

## Remaining UI Components

1. **components/ui/select.tsx** - Select dropdown component
2. **components/ui/slider.tsx** - Slider component  
3. **components/ui/tooltip.tsx** - Tooltip component
4. **components/ui/dropdown-menu.tsx** - Dropdown menu component
5. **components/ui/label.tsx** - Label component

## Remaining Custom Components

1. **components/custom/live-caption.tsx** - Live caption rendering with word highlighting
2. **components/custom/summary-panel.tsx** - Summary display with tabs
3. **components/custom/accessibility-toolbar.tsx** - A11y controls toolbar
4. **components/custom/playback-controls.tsx** - Playback controls
5. **components/custom/metrics-strip.tsx** - Real-time metrics display
6. **components/custom/evaluation-panel.tsx** - WER/ROUGE evaluation UI
7. **components/custom/feedback-modal.tsx** - User feedback form

## Remaining App Pages

1. **app/live/page.tsx** - Live captioning page
2. **app/library/page.tsx** - Session library listing
3. **app/library/[id]/page.tsx** - Session detail page
4. **app/evaluate/page.tsx** - Evaluation dashboard
5. **app/settings/page.tsx** - Settings page

## Remaining API Routes

1. **app/api/sessions/route.ts** - GET all sessions
2. **app/api/sessions/[id]/route.ts** - GET session by ID
3. **app/api/stream/[id]/route.ts** - SSE streaming endpoint
4. **app/api/sessions/[id]/feedback/route.ts** - POST feedback

## Seed Data Script

1. **scripts/seed.ts** - Generate demo sessions with realistic data

## Additional Files

1. **next-env.d.ts** - Next.js TypeScript definitions (auto-generated)
2. **.env.example** - Environment variables template
3. **README.md** - Complete project documentation

## Implementation Priority

### High Priority (Core Functionality)
1. Live captioning page and components
2. Remaining UI components (select, slider, tooltip)
3. API routes for sessions and streaming

### Medium Priority
1. Library pages
2. Evaluation dashboard
3. Settings page

### Low Priority
1. Seed script
2. Additional polish and edge cases

## Quick Start Template

To quickly scaffold remaining files, use this pattern:

### UI Component Template
```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function ComponentName({ className, ...props }: Props) {
  return <div className={cn("...", className)} {...props} />;
}
```

### Page Template
```tsx
"use client";
import { useEffect } from "react";

export default function PageName() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page content */}
    </main>
  );
}
```

### API Route Template
```ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ /* data */ });
}
```
