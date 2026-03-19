import { PropsWithChildren, ReactNode } from 'react';

interface ShellCardProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function ShellCard({ title, eyebrow, action, children }: ShellCardProps) {
  return (
    <section className="shell-card">
      <header className="shell-card__header">
        <div>
          {eyebrow ? <div className="shell-card__eyebrow">{eyebrow}</div> : null}
          <h2>{title}</h2>
        </div>
        {action}
      </header>
      <div>{children}</div>
    </section>
  );
}
