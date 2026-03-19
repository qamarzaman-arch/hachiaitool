import { useEffect } from 'react';
import { Bot, FolderKanban, ScanSearch, ShieldEllipsis } from 'lucide-react';
import { RecorderControls } from '@/components/RecorderControls';
import { EventTimeline } from '@/components/EventTimeline';
import { WorkflowEditor } from '@/components/WorkflowEditor';
import { ArchitecturePanel } from '@/components/ArchitecturePanel';
import { DeliveryPanel } from '@/components/DeliveryPanel';
import { SelectedStepPanel } from '@/components/SelectedStepPanel';
import { useRecorderStore } from '@/features/recorder/useRecorderStore';
import { useRecorderSimulator } from '@/hooks/useRecorderSimulator';

export function App() {
  const setPlatformDetails = useRecorderStore((state) => state.setPlatformDetails);

  useRecorderSimulator();

  useEffect(() => {
    async function hydrateDesktopMetadata() {
      const platform = (await window.hachiaiDesktop?.getPlatform()) ?? 'browser';
      const version = (await window.hachiaiDesktop?.getVersion()) ?? '0.1.0';
      setPlatformDetails(platform, version);
    }

    hydrateDesktopMetadata();
  }, [setPlatformDetails]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">八</div>
          <h1>HachiAI Requirements Gathering Tool</h1>
          <p>
            Production-oriented desktop workspace for capturing workflows, documenting requirements,
            and exporting polished process guides.
          </p>
        </div>

        <nav className="sidebar-nav">
          <span><ScanSearch size={16} /> Capture</span>
          <span><Bot size={16} /> AI step generation</span>
          <span><FolderKanban size={16} /> Workflow studio</span>
          <span><ShieldEllipsis size={16} /> Privacy</span>
        </nav>
      </aside>

      <main className="content">
        <RecorderControls />
        <div className="content-grid content-grid--primary">
          <EventTimeline />
          <WorkflowEditor />
        </div>
        <div className="content-grid content-grid--secondary">
          <SelectedStepPanel />
          <ArchitecturePanel />
        </div>
        <DeliveryPanel />
      </main>
    </div>
  );
}
