import { DragEvent } from 'react';
import { GripVertical, PencilLine, Presentation, Trash2 } from 'lucide-react';
import { useFilteredWorkflow, useRecorderStore } from '@/features/recorder/useRecorderStore';
import { ShellCard } from './ShellCard';
import { StatusPill } from './StatusPill';

const gradientMap: Record<string, string> = {
  'gradient-1': 'linear-gradient(135deg, #60a5fa, #1d4ed8)',
  'gradient-2': 'linear-gradient(135deg, #34d399, #0f766e)',
  'gradient-3': 'linear-gradient(135deg, #f59e0b, #b45309)',
  'gradient-4': 'linear-gradient(135deg, #f472b6, #7c3aed)',
};

export function WorkflowEditor() {
  const workflow = useRecorderStore((state) => state.workflow);
  const searchQuery = useRecorderStore((state) => state.searchQuery);
  const updateStepDescription = useRecorderStore((state) => state.updateStepDescription);
  const deleteStep = useRecorderStore((state) => state.deleteStep);
  const reorderStep = useRecorderStore((state) => state.reorderStep);
  const selectStep = useRecorderStore((state) => state.selectStep);
  const selectedStepId = useRecorderStore((state) => state.selectedStepId);
  const exportOptions = useRecorderStore((state) => state.exportOptions);
  const exportWorkflow = useRecorderStore((state) => state.exportWorkflow);
  const filteredWorkflow = useFilteredWorkflow(workflow, searchQuery);

  const onDragStart = (event: DragEvent<HTMLElement>, sectionId: string, index: number) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ sectionId, index }));
  };

  const onDrop = (event: DragEvent<HTMLElement>, sectionId: string, index: number) => {
    const payload = event.dataTransfer.getData('text/plain');
    if (!payload) return;
    const { sectionId: sourceSectionId, index: sourceIndex } = JSON.parse(payload) as {
      sectionId: string;
      index: number;
    };
    if (sourceSectionId === sectionId) {
      reorderStep(sectionId, sourceIndex, index);
    }
  };

  return (
    <ShellCard
      title="Workflow studio"
      eyebrow="Interactive editor"
      action={
        <div className="export-actions">
          {exportOptions.map((option) => (
            <button className="secondary-button" key={option.id} onClick={() => exportWorkflow(option.id)}>
              <Presentation size={16} /> {option.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="workflow-sections">
        {filteredWorkflow.map((section) => (
          <div className="workflow-section" key={section.id}>
            <div className="workflow-section__header">
              <h3>{section.title}</h3>
              <span>{section.steps.length} steps</span>
            </div>
            <div className="steps-list">
              {section.steps.map((step, index) => (
                <article
                  className={`step-card ${selectedStepId === step.id ? 'step-card--selected' : ''}`}
                  key={step.id}
                  draggable
                  onDragStart={(event) => onDragStart(event, section.id, index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => onDrop(event, section.id, index)}
                  onClick={() => selectStep(step.id)}
                >
                  <div className="step-card__media" style={{ background: gradientMap[step.screenshot] }}>
                    <span>Step {index + 1}</span>
                    <small>{step.timestamp}</small>
                  </div>
                  <div className="step-card__content">
                    <div className="step-card__toolbar">
                      <div className="step-card__toolbar-left">
                        <GripVertical size={16} />
                        <strong>{step.title}</strong>
                      </div>
                      <div className="step-card__toolbar-right">
                        <StatusPill active={step.confidence > 0.9} label={`${Math.round(step.confidence * 100)}% confidence`} />
                        <button
                          aria-label="Delete step"
                          className="icon-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteStep(step.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <label className="editor-label">
                      <span>
                        <PencilLine size={14} /> AI-generated description
                      </span>
                      <textarea
                        value={step.description}
                        onChange={(event) => updateStepDescription(step.id, event.target.value)}
                        rows={4}
                      />
                    </label>
                    <div className="step-card__footer">
                      <span>Section: {step.section}</span>
                      <span>Events: {step.sourceEventIds.join(', ')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
        {!filteredWorkflow.length ? <div className="empty-state">No steps match the current search.</div> : null}
      </div>
    </ShellCard>
  );
}
