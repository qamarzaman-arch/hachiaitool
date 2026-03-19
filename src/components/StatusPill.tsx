interface StatusPillProps {
  active?: boolean;
  label: string;
}

export function StatusPill({ active = false, label }: StatusPillProps) {
  return <span className={`status-pill ${active ? 'status-pill--active' : ''}`}>{label}</span>;
}
