import { Globe, Keyboard, Monitor, MousePointerClick, FolderInput } from 'lucide-react';
import { ActivityEvent } from '@/types/domain';
import { ShellCard } from './ShellCard';
import { useRecorderStore } from '@/features/recorder/useRecorderStore';

const iconMap = {
  app_launch: Monitor,
  window_focus: Monitor,
  mouse_click: MousePointerClick,
  keyboard_input: Keyboard,
  file_event: FolderInput,
  browser_navigation: Globe,
};

function EventRow({ event }: { event: ActivityEvent }) {
  const Icon = iconMap[event.actionType];

  return (
    <div className="timeline-row">
      <div className="timeline-row__icon">
        <Icon size={16} />
      </div>
      <div className="timeline-row__body">
        <div className="timeline-row__meta">
          <strong>{event.appName}</strong>
          <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className="timeline-row__title">{event.summary}</div>
        <div className="timeline-row__details">
          <span>{event.windowTitle}</span>
          {event.browser ? <span>{event.browser.pageTitle}</span> : null}
          {event.browser ? <span>{event.browser.url}</span> : null}
          {event.coordinates ? <span>{`${event.coordinates.x}, ${event.coordinates.y}`}</span> : null}
        </div>
      </div>
    </div>
  );
}

export function EventTimeline() {
  const events = useRecorderStore((state) => state.events);

  return (
    <ShellCard title="Live event timeline" eyebrow="Captured metadata">
      <div className="timeline-list">
        {events.map((event) => (
          <EventRow event={event} key={event.id} />
        ))}
      </div>
    </ShellCard>
  );
}
