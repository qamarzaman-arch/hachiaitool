import { Pause, Play, Search, Shield, TimerReset, WandSparkles } from 'lucide-react';
import { ShellCard } from './ShellCard';
import { StatusPill } from './StatusPill';
import { useRecorderStore } from '@/features/recorder/useRecorderStore';

export function RecorderControls() {
  const {
    isRecording,
    startRecording,
    stopRecording,
    platform,
    appVersion,
    policy,
    updatePolicy,
    searchQuery,
    setSearchQuery,
    exportStatus,
    events,
  } = useRecorderStore();

  return (
    <ShellCard
      title="Recorder control center"
      eyebrow="Background service"
      action={<StatusPill active={isRecording} label={isRecording ? 'Recording live' : 'Paused'} />}
    >
      <div className="hero-grid">
        <div className="hero-panel">
          <p>
            Capture system-level actions, browser context, and workflow-ready steps with privacy-first
            controls, auto-grouping, and resilient local session persistence.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? <Pause size={16} /> : <Play size={16} />}
              {isRecording ? 'Pause recording' : 'Start recording'}
            </button>
            <button className="secondary-button" onClick={() => updatePolicy({ excludedApps: [] })}>
              <TimerReset size={16} />
              Reset exclusions
            </button>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search workflow steps, sections, or descriptions"
            />
          </label>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span>Platform</span>
            <strong>{platform}</strong>
          </div>
          <div className="stat-card">
            <span>App version</span>
            <strong>{appVersion}</strong>
          </div>
          <div className="stat-card">
            <span>Events captured</span>
            <strong>{events.length}</strong>
          </div>
          <div className="stat-card">
            <span>Recorder status</span>
            <strong>{exportStatus ?? 'Ready'}</strong>
          </div>
        </div>
      </div>
      <div className="policy-row">
        <label>
          <input
            type="checkbox"
            checked={policy.blurSensitiveRegions}
            onChange={(event) => updatePolicy({ blurSensitiveRegions: event.target.checked })}
          />
          Blur sensitive regions in screenshots
        </label>
        <label>
          <input
            type="checkbox"
            checked={policy.redactKeyboardMetadata}
            onChange={(event) => updatePolicy({ redactKeyboardMetadata: event.target.checked })}
          />
          Never store raw keystrokes
        </label>
        <label>
          <input
            type="checkbox"
            checked={policy.allowBrowserExtensionBridge}
            onChange={(event) => updatePolicy({ allowBrowserExtensionBridge: event.target.checked })}
          />
          Enable browser extension bridge
        </label>
      </div>
      <div className="policy-banner">
        <Shield size={16} />
        <span>Excluded apps: {policy.excludedApps.join(', ') || 'None'}</span>
        <span>
          <WandSparkles size={16} /> Workflow grouping updates automatically when capture data changes.
        </span>
      </div>
    </ShellCard>
  );
}
