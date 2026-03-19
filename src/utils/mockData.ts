import { ActivityEvent, RecordingPolicy, WorkflowSection } from '@/types/domain';

export const defaultPolicy: RecordingPolicy = {
  blurSensitiveRegions: true,
  redactKeyboardMetadata: true,
  excludedApps: ['1Password', 'Bitwarden', 'Banking Portal'],
  allowBrowserExtensionBridge: true,
};

export const recorderTemplates: Omit<ActivityEvent, 'id' | 'timestamp'>[] = [
  {
    appName: 'Microsoft Edge',
    windowTitle: 'HachiAI Dashboard',
    actionType: 'app_launch',
    summary: 'Opened Edge from the taskbar.',
  },
  {
    appName: 'Microsoft Edge',
    windowTitle: 'HachiAI Dashboard',
    actionType: 'browser_navigation',
    summary: 'Navigated to the requirements dashboard.',
    browser: {
      url: 'https://example.hachiai.app/dashboard',
      pageTitle: 'Requirements Dashboard',
      domContext: 'Primary nav > Dashboard > New workflow',
    },
  },
  {
    appName: 'Microsoft Edge',
    windowTitle: 'HachiAI Dashboard',
    actionType: 'mouse_click',
    summary: 'Clicked the Create workflow button.',
    coordinates: { x: 944, y: 218 },
  },
  {
    appName: 'Microsoft Excel',
    windowTitle: 'Quarterly Forecast.xlsx',
    actionType: 'window_focus',
    summary: 'Switched focus to Excel for source data review.',
  },
  {
    appName: 'Microsoft Excel',
    windowTitle: 'Quarterly Forecast.xlsx',
    actionType: 'keyboard_input',
    summary: 'Captured non-sensitive keyboard activity metadata for data entry.',
  },
  {
    appName: 'File Explorer',
    windowTitle: 'Requirements Evidence',
    actionType: 'file_event',
    summary: 'Saved the supporting evidence package.',
  },
];

export const sampleEvents: ActivityEvent[] = recorderTemplates.map((event, index) => ({
  ...event,
  id: `evt-${index + 1}`,
  timestamp: new Date(Date.UTC(2026, 2, 19, 8, 30 + index, 0)).toISOString(),
}));

export const sampleWorkflow: WorkflowSection[] = [
  {
    id: 'sec-login',
    title: 'Launch and Navigation',
    steps: [
      {
        id: 'step-1',
        title: 'Launch the primary browser',
        description: 'The user starts Microsoft Edge to begin the requirements capture session.',
        timestamp: '08:30:00',
        section: 'Launch and Navigation',
        screenshot: 'gradient-1',
        confidence: 0.98,
        sourceEventIds: ['evt-1'],
      },
      {
        id: 'step-2',
        title: 'Open the workflow dashboard',
        description:
          'The browser bridge captures the page title, URL, and DOM context so the AI engine can summarize the navigation step.',
        timestamp: '08:31:00',
        section: 'Launch and Navigation',
        screenshot: 'gradient-2',
        confidence: 0.94,
        sourceEventIds: ['evt-2', 'evt-3'],
      },
    ],
  },
  {
    id: 'sec-data',
    title: 'Data Review and Save',
    steps: [
      {
        id: 'step-3',
        title: 'Review and save supporting evidence',
        description:
          'Desktop focus changes, keyboard metadata, and file activity are grouped into a reusable workflow step for export.',
        timestamp: '08:33:00',
        section: 'Data Review and Save',
        screenshot: 'gradient-3',
        confidence: 0.9,
        sourceEventIds: ['evt-4', 'evt-5', 'evt-6'],
      },
    ],
  },
];
