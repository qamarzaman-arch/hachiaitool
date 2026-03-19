import { ExportArtifact, WorkflowSection } from '@/types/domain';

function flattenWorkflow(workflow: WorkflowSection[]) {
  return workflow.flatMap((section) =>
    section.steps.map((step, index) => ({
      order: index + 1,
      ...step,
    })),
  );
}

export function buildExportArtifact(format: 'pdf' | 'ppt' | 'docx', workflow: WorkflowSection[]): ExportArtifact {
  const steps = flattenWorkflow(workflow);

  if (format === 'ppt') {
    return {
      fileName: 'hachiai-workflow-export.ppt.json',
      mimeType: 'application/json',
      content: JSON.stringify(
        {
          type: 'ppt-outline',
          slides: steps.map((step) => ({
            title: step.title,
            section: step.section,
            body: step.description,
          })),
        },
        null,
        2,
      ),
    };
  }

  if (format === 'docx') {
    return {
      fileName: 'hachiai-workflow-export.doc.md',
      mimeType: 'text/markdown',
      content: steps
        .map(
          (step) => `## ${step.section} - ${step.title}\n\n${step.description}\n\nTimestamp: ${step.timestamp}`,
        )
        .join('\n\n'),
    };
  }

  return {
    fileName: 'hachiai-workflow-export.html',
    mimeType: 'text/html',
    content: `<!doctype html><html><head><meta charset="utf-8"><title>HachiAI Export</title></head><body>${steps
      .map(
        (step) => `<section><h2>${step.section}</h2><h3>${step.title}</h3><p>${step.description}</p><small>${step.timestamp}</small></section>`,
      )
      .join('')}</body></html>`,
  };
}

export function downloadArtifact(artifact: ExportArtifact) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([artifact.content], { type: artifact.mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = artifact.fileName;
  link.click();
  URL.revokeObjectURL(url);
}
