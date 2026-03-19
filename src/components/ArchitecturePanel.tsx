import { Cpu, Database, Image, Layers3, ShieldCheck, WandSparkles } from 'lucide-react';
import { platformCapabilities, roadmap } from '@/services/architecture';
import { ShellCard } from './ShellCard';

const icons = [Cpu, ShieldCheck, Image, WandSparkles, Layers3, Database];

export function ArchitecturePanel() {
  return (
    <ShellCard title="Production architecture" eyebrow="System design">
      <div className="capability-grid">
        {platformCapabilities.map((capability, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article className="capability-card" key={capability.name}>
              <div className="capability-card__title">
                <Icon size={18} />
                <h3>{capability.name}</h3>
              </div>
              <p>{capability.description}</p>
              <ul>
                {capability.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <div className="roadmap">
        <h3>Implementation roadmap</h3>
        <ol>
          {roadmap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    </ShellCard>
  );
}
