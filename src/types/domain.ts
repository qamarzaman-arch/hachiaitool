export type ActionType =
  | 'app_launch'
  | 'window_focus'
  | 'mouse_click'
  | 'keyboard_input'
  | 'file_event'
  | 'browser_navigation';

export interface RecordingPolicy {
  blurSensitiveRegions: boolean;
  redactKeyboardMetadata: boolean;
  excludedApps: string[];
  allowBrowserExtensionBridge: boolean;
}

export interface BrowserContext {
  url: string;
  pageTitle: string;
  domContext: string;
}

export interface ActivityEvent {
  id: string;
  appName: string;
  windowTitle: string;
  actionType: ActionType;
  timestamp: string;
  summary: string;
  coordinates?: { x: number; y: number };
  browser?: BrowserContext;
  isSensitive?: boolean;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  section: string;
  screenshot: string;
  confidence: number;
  sourceEventIds: string[];
}

export interface WorkflowSection {
  id: string;
  title: string;
  steps: WorkflowStep[];
}

export interface ExportOption {
  id: 'pdf' | 'ppt' | 'docx';
  label: string;
  description: string;
}

export interface CaptureSession {
  events: ActivityEvent[];
  workflow: WorkflowSection[];
  policy: RecordingPolicy;
  isRecording: boolean;
  searchQuery: string;
  selectedStepId: string | null;
  exportedAt?: string;
}

export interface ExportArtifact {
  fileName: string;
  mimeType: string;
  content: string;
}
