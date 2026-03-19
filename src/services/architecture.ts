export const platformCapabilities = [
  {
    name: 'Recorder Core',
    description:
      'Background orchestration service normalizing system hooks, browser events, screenshot triggers, persistence, and privacy policies.',
    technologies: ['Electron main process', 'TypeScript domain layer', 'Future Rust sidecar'],
  },
  {
    name: 'Windows Activity Capture',
    description:
      'Pluggable adapter designed for Win32/UI Automation hooks, active window detection, file event monitoring, and safe keyboard metadata capture.',
    technologies: ['SetWindowsHookEx', 'UI Automation', 'ETW / PowerShell adapters'],
  },
  {
    name: 'Screenshot Engine',
    description:
      'Event-driven capture pipeline with duplicate detection, click highlighting, WebP compression, and optional sensitive-region blur.',
    technologies: ['desktopCapturer', 'Sharp', 'perceptual hashing'],
  },
  {
    name: 'AI Description Service',
    description:
      'Batch-friendly summarization layer that converts screenshots and structured events into workflow steps and section summaries.',
    technologies: ['OpenAI / Ollama adapters', 'Prompt templates', 'retry queue'],
  },
  {
    name: 'Workflow Studio',
    description:
      'React editor for review, search, step selection, editing, drag-and-drop ordering, and export packaging.',
    technologies: ['React', 'Zustand', 'Framer Motion'],
  },
  {
    name: 'Export Layer',
    description:
      'Export abstraction that emits HTML/PDF-ready, PowerPoint-outline, and document-friendly artifacts from the same workflow model.',
    technologies: ['PDFKit / Puppeteer', 'PptxGenJS', 'templating layer'],
  },
];

export const roadmap = [
  'Replace the simulator with native Windows recorder adapters behind a RecorderPort interface.',
  'Persist capture sessions and export history in SQLite with background job metadata.',
  'Ship Chrome and Edge extensions with native messaging and DOM event capture.',
  'Add password-field masking heuristics plus allowlist and denylist policy management.',
  'Package signed Windows builds with NSIS in CI and publish release artifacts automatically.',
];
