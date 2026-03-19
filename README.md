# HachiAI Requirements Gathering Tool

HachiAI Requirements Gathering Tool is a Windows-first, cross-platform desktop application for capturing user workflows, turning them into structured documentation, and preparing them for export.

## What is included

- **Electron + Vite + React + TypeScript desktop shell**.
- **Connected MVP workflow** for recording, event ingestion, workflow generation, editing, selection, search, and export.
- **Privacy-first controls** for excluded apps, screenshot masking intent, browser bridge enablement, and keyboard redaction.
- **Local persistence** so sessions survive reloads through browser/Electron local storage.
- **Production architecture blueprint** for native Windows hooks, screenshot processing, browser extension messaging, AI step generation, and exporter services.

## Current implementation status

This repository now delivers a connected desktop MVP instead of a static mock shell.

### Working today

- Start/pause recording controls with a background recorder simulator.
- Automatic event ingestion into the timeline.
- Workflow auto-generation from captured events.
- Search/filtering across workflow content.
- Step selection, editing, deletion, and drag-and-drop reordering within sections.
- Export actions for HTML/PDF-ready, PowerPoint-outline, and Word/markdown artifacts.
- Local session persistence for recorder state, workflow state, and export timestamps.
- Electron desktop bootstrapping with a secure preload bridge.

### Next production steps

1. Replace the simulator with native Windows adapters for active window, click, UI Automation, and safe keyboard metadata capture.
2. Add smart screenshots with WebP compression and perceptual hash diffing.
3. Introduce SQLite persistence and export job history.
4. Add Chrome/Edge extensions with native messaging for URLs, tabs, and DOM context.
5. Wire AI description generation using OpenAI or Ollama behind a job queue.
6. Add signed Windows build/release automation.

## Project structure

```text
.
├── electron/                # Electron main + preload bridge
├── src/
│   ├── app/                 # App shell
│   ├── components/          # Recorder, timeline, editor, details, architecture, delivery panels
│   ├── features/recorder/   # Zustand store and recorder workflows
│   ├── hooks/               # Background recorder simulator hook
│   ├── services/            # Export, persistence, workflow builder, architecture metadata
│   ├── styles/              # Global styling
│   ├── types/               # Domain types
│   └── utils/               # Mock templates and defaults
├── package.json             # Scripts and packaging config
└── README.md
```

## Run locally

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Start the desktop app

```bash
npm run dev
```

### Type-check

```bash
npm run lint
```

### Build distributables

```bash
npm run build
```

> On Windows, Electron Builder will produce an NSIS installer in `release/`.

## Product architecture

### Core modules

- **Recorder Core**: orchestrates system hooks, browser bridge events, screenshot triggers, persistence, and privacy policy enforcement.
- **Event Processor**: converts raw capture data into normalized `ActivityEvent` records.
- **Workflow Builder**: groups events into user-friendly `WorkflowSection` and `WorkflowStep` objects.
- **Workflow Studio**: supports search, edit, delete, reorder, inspect, and export flows.
- **Export Engine**: emits format-specific artifacts from the normalized workflow model.
- **Persistence Layer**: stores the latest local session for resume/review behavior.

### Privacy guardrails

- Raw keystrokes are never persisted.
- Sensitive apps can be excluded from recording.
- Sensitive screenshot regions can be blurred before storage.
- User consent and pause/resume controls are part of the main recording surface.

## Suggested implementation roadmap

### Phase 1: Native recorder foundation
- Win32 active window tracking.
- UIA element metadata lookup for click context.
- SetWindowsHookEx-based metadata capture.
- Exclusion rules for password managers and banking apps.

### Phase 2: Smart capture pipeline
- Desktop screenshot capture.
- Perceptual hash dedupe.
- Click highlighting and safe blur regions.
- Storage in SQLite-backed session tables.

### Phase 3: Browser instrumentation
- Chrome/Edge extensions.
- Native messaging host.
- URL, title, DOM context, and click metadata ingestion.

### Phase 4: AI + export
- Prompt templates for step generation.
- Background job queue for batching.
- PDF/PPT exporters.
- Final document styling templates.

## Notes

- Electron is used here to deliver a complete TypeScript-first desktop app quickly while remaining cross-platform and packaging-friendly.
- For lower-level Windows hooks or performance-critical capture, add a Rust or native sidecar behind the recorder interfaces already modeled in the app.
