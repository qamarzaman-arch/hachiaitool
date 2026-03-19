import { Clock3, Image as ImageIcon, Link2, Sparkles } from 'lucide-react';
import { useRecorderStore } from '@/features/recorder/useRecorderStore';
import { ShellCard } from './ShellCard';

const gradientMap: Record<string, string> = {
  'gradient-1': 'linear-gradient(135deg, #60a5fa, #1d4ed8)',
  'gradient-2': 'linear-gradient(135deg, #34d399, #0f766e)',
  'gradient-3': 'linear-gradient(135deg, #f59e0b, #b45309)',
  'gradient-4': 'linear-gradient(135deg, #f472b6, #7c3aed)',
};

export function SelectedStepPanel() {
  const workflow = useRecorderStore((state) => state.workflow);
  const selectedStepId = useRecorderStore((state) => state.selectedStepId);

  const selectedStep = workflow.flatMap((section) => section.steps).find((step) => step.id === selectedStepId) ?? workflow[0]?.steps[0];

  if (!selectedStep) {
    return (
      <ShellCard title="Step details" eyebrow="Focused review">
        <div className="empty-state">Select a workflow step to inspect its generated documentation.</div>
      </ShellCard>
    );
  }

  return (
    <ShellCard title="Step details" eyebrow="Focused review">
      <div className="step-preview" style={{ background: gradientMap[selectedStep.screenshot] }}>
        <ImageIcon size={20} />
        <strong>{selectedStep.title}</strong>
      </div>
      <div className="detail-list">
        <div><Clock3 size={16} /> Timestamp: {selectedStep.timestamp}</div>
        <div><Sparkles size={16} /> Confidence: {Math.round(selectedStep.confidence * 100)}%</div>
        <div><Link2 size={16} /> Source events: {selectedStep.sourceEventIds.join(', ')}</div>
      </div>
      <p className="detail-description">{selectedStep.description}</p>
    </ShellCard>
  );
}
