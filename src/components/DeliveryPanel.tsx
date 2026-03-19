import { FileText, FileType2, LayoutTemplate, Lock, Rocket } from 'lucide-react';
import { useRecorderStore } from '@/features/recorder/useRecorderStore';
import { ShellCard } from './ShellCard';

export function DeliveryPanel() {
  const policy = useRecorderStore((state) => state.policy);
  const exportedAt = useRecorderStore((state) => state.exportedAt);

  const deliverables = [
    {
      title: 'Windows installer path',
      description: 'Electron Builder remains configured for NSIS packaging and release output generation.',
      icon: Rocket,
    },
    {
      title: 'Structured exports',
      description: `Exports are wired end-to-end and last generated at ${exportedAt ? new Date(exportedAt).toLocaleString() : 'not yet exported'}.`,
      icon: FileText,
    },
    {
      title: 'Privacy controls',
      description: `Blur: ${policy.blurSensitiveRegions ? 'On' : 'Off'} · Keyboard redaction: ${policy.redactKeyboardMetadata ? 'On' : 'Off'}`,
      icon: Lock,
    },
    {
      title: 'Workflow editing UX',
      description: 'Step editing, selection, deletion, and within-section drag-and-drop reordering are active in the studio.',
      icon: LayoutTemplate,
    },
    {
      title: 'Browser bridge readiness',
      description: `Browser extension bridge is ${policy.allowBrowserExtensionBridge ? 'enabled' : 'disabled'} in the active policy.`,
      icon: FileType2,
    },
  ];

  return (
    <ShellCard title="Delivery scope" eyebrow="Release readiness">
      <div className="delivery-grid">
        {deliverables.map(({ title, description, icon: Icon }) => (
          <article key={title} className="delivery-card">
            <Icon size={18} />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </ShellCard>
  );
}
