import { create } from 'zustand';
import { buildExportArtifact, downloadArtifact } from '@/services/exportService';
import { loadSession, saveSession } from '@/services/persistence';
import { buildWorkflow } from '@/services/workflowBuilder';
import { ActivityEvent, CaptureSession, ExportOption, RecordingPolicy, WorkflowSection } from '@/types/domain';
import { defaultPolicy, recorderTemplates, sampleEvents, sampleWorkflow } from '@/utils/mockData';

const exportOptions: ExportOption[] = [
  { id: 'pdf', label: 'PDF', description: 'Generate a formatted HTML/PDF-ready workflow export.' },
  { id: 'ppt', label: 'PowerPoint', description: 'Generate a slide-outline JSON artifact for PPT export.' },
  { id: 'docx', label: 'Word', description: 'Generate a markdown document artifact for DOCX conversion.' },
];

const baseSession: CaptureSession = {
  events: sampleEvents,
  workflow: sampleWorkflow,
  policy: defaultPolicy,
  isRecording: false,
  searchQuery: '',
  selectedStepId: sampleWorkflow[0]?.steps[0]?.id ?? null,
};

interface RecorderState extends CaptureSession {
  platform: string;
  appVersion: string;
  exportOptions: ExportOption[];
  exportStatus: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  setPlatformDetails: (platform: string, appVersion: string) => void;
  updatePolicy: (policy: Partial<RecordingPolicy>) => void;
  setSearchQuery: (query: string) => void;
  updateStepDescription: (stepId: string, description: string) => void;
  selectStep: (stepId: string) => void;
  appendSimulatedEvent: () => void;
  reorderStep: (sectionId: string, fromIndex: number, toIndex: number) => void;
  deleteStep: (stepId: string) => void;
  exportWorkflow: (format: ExportOption['id']) => void;
}

const storedSession = loadSession();
const initialSession = storedSession ?? baseSession;

function snapshot(state: RecorderState): CaptureSession {
  return {
    events: state.events,
    workflow: state.workflow,
    policy: state.policy,
    isRecording: state.isRecording,
    searchQuery: state.searchQuery,
    selectedStepId: state.selectedStepId,
    exportedAt: state.exportedAt,
  };
}

function persistState(state: RecorderState, overrides: Partial<CaptureSession>): Partial<RecorderState> {
  const session: CaptureSession = {
    ...snapshot(state),
    ...overrides,
  };
  saveSession(session);
  return session;
}

export const useRecorderStore = create<RecorderState>((set, get) => ({
  ...initialSession,
  platform: 'desktop',
  appVersion: '0.1.0',
  exportOptions,
  exportStatus: null,
  startRecording: () =>
    set((state) => ({
      ...persistState(state, { isRecording: true }),
      exportStatus: 'Recording started',
    })),
  stopRecording: () =>
    set((state) => ({
      ...persistState(state, { isRecording: false, workflow: buildWorkflow([...state.events].reverse()) }),
      exportStatus: 'Recording paused and workflow refreshed',
    })),
  setPlatformDetails: (platform, appVersion) => set({ platform, appVersion }),
  updatePolicy: (policy) =>
    set((state) => ({
      ...persistState(state, { policy: { ...state.policy, ...policy } }),
      exportStatus: 'Privacy policy updated',
    })),
  setSearchQuery: (query) =>
    set((state) => ({
      ...persistState(state, { searchQuery: query }),
    })),
  updateStepDescription: (stepId, description) =>
    set((state) => {
      const workflow = state.workflow.map((section) => ({
        ...section,
        steps: section.steps.map((step) => (step.id === stepId ? { ...step, description } : step)),
      }));
      return {
        ...persistState(state, { workflow }),
        exportStatus: 'Step description updated',
      };
    }),
  selectStep: (stepId) =>
    set((state) => ({
      ...persistState(state, { selectedStepId: stepId }),
    })),
  appendSimulatedEvent: () =>
    set((state) => {
      const template = recorderTemplates[state.events.length % recorderTemplates.length];
      if (state.policy.excludedApps.includes(template.appName)) {
        return { exportStatus: `${template.appName} is excluded from recording` };
      }

      const nextEvent: ActivityEvent = {
        ...template,
        id: `evt-${state.events.length + 1}`,
        timestamp: new Date().toISOString(),
        isSensitive: false,
      };
      const events = [nextEvent, ...state.events].slice(0, 24);
      const workflow = buildWorkflow([...events].reverse());
      return {
        ...persistState(state, {
          events,
          workflow,
          selectedStepId: workflow[0]?.steps[0]?.id ?? state.selectedStepId,
        }),
        exportStatus: `Captured ${nextEvent.actionType.replace('_', ' ')}`,
      };
    }),
  reorderStep: (sectionId, fromIndex, toIndex) =>
    set((state) => {
      const workflow = state.workflow.map((section) => {
        if (section.id !== sectionId) return section;
        const steps = [...section.steps];
        const [moved] = steps.splice(fromIndex, 1);
        if (!moved) return section;
        steps.splice(toIndex, 0, moved);
        return { ...section, steps };
      });
      return {
        ...persistState(state, { workflow }),
        exportStatus: 'Step order updated',
      };
    }),
  deleteStep: (stepId) =>
    set((state) => {
      const workflow = state.workflow
        .map((section) => ({
          ...section,
          steps: section.steps.filter((step) => step.id !== stepId),
        }))
        .filter((section) => section.steps.length > 0);
      return {
        ...persistState(state, {
          workflow,
          selectedStepId: workflow[0]?.steps[0]?.id ?? null,
        }),
        exportStatus: 'Step removed from workflow',
      };
    }),
  exportWorkflow: (format) => {
    const state = get();
    const artifact = buildExportArtifact(format, state.workflow);
    downloadArtifact(artifact);
    set((current) => ({
      ...persistState(current, { exportedAt: new Date().toISOString() }),
      exportStatus: `Exported workflow as ${format.toUpperCase()}`,
    }));
  },
}));

export function useFilteredWorkflow(workflow: WorkflowSection[], searchQuery: string) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return workflow;
  return workflow
    .map((section) => ({
      ...section,
      steps: section.steps.filter(
        (step) =>
          step.title.toLowerCase().includes(query) ||
          step.description.toLowerCase().includes(query) ||
          step.section.toLowerCase().includes(query),
      ),
    }))
    .filter((section) => section.steps.length > 0);
}
