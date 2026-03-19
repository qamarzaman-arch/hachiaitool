import { ActivityEvent, WorkflowSection, WorkflowStep } from '@/types/domain';

const screenshotPalette = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4'];

function sectionForEvent(event: ActivityEvent) {
  switch (event.actionType) {
    case 'app_launch':
    case 'browser_navigation':
      return 'Launch and Navigation';
    case 'mouse_click':
      return 'Task Execution';
    case 'window_focus':
    case 'keyboard_input':
      return 'Data Review';
    case 'file_event':
      return 'Save and Export';
    default:
      return 'Captured Workflow';
  }
}

function titleForGroup(events: ActivityEvent[]) {
  const [first] = events;
  if (!first) return 'Captured step';
  if (first.actionType === 'browser_navigation' && first.browser) {
    return `Navigate to ${first.browser.pageTitle}`;
  }
  if (first.actionType === 'mouse_click') {
    return `Interact with ${first.appName}`;
  }
  if (first.actionType === 'file_event') {
    return `Save work from ${first.appName}`;
  }
  return `${first.appName}: ${first.summary.replace(/\.$/, '')}`;
}

function descriptionForGroup(events: ActivityEvent[]) {
  return events
    .map((event) => {
      const browserContext = event.browser
        ? ` Browser context: ${event.browser.pageTitle} (${event.browser.url}) in ${event.browser.domContext}.`
        : '';
      const coordinates = event.coordinates
        ? ` Click coordinates: ${event.coordinates.x}, ${event.coordinates.y}.`
        : '';
      return `${event.summary}${browserContext}${coordinates}`;
    })
    .join(' ');
}

export function buildWorkflow(events: ActivityEvent[]): WorkflowSection[] {
  const grouped = new Map<string, ActivityEvent[]>();

  events.forEach((event) => {
    const section = sectionForEvent(event);
    const items = grouped.get(section) ?? [];
    items.push(event);
    grouped.set(section, items);
  });

  return Array.from(grouped.entries()).map(([sectionTitle, sectionEvents], sectionIndex) => {
    const chunkSize = 2;
    const steps: WorkflowStep[] = [];
    for (let i = 0; i < sectionEvents.length; i += chunkSize) {
      const group = sectionEvents.slice(i, i + chunkSize);
      const first = group[0];
      steps.push({
        id: `step-${sectionIndex + 1}-${steps.length + 1}`,
        title: titleForGroup(group),
        description: descriptionForGroup(group),
        timestamp: new Date(first.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        section: sectionTitle,
        screenshot: screenshotPalette[(sectionIndex + steps.length) % screenshotPalette.length],
        confidence: Number((0.82 + Math.min(group.length * 0.06, 0.15)).toFixed(2)),
        sourceEventIds: group.map((event) => event.id),
      });
    }

    return {
      id: `section-${sectionIndex + 1}`,
      title: sectionTitle,
      steps,
    };
  });
}
