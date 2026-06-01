import { type SystemOverview } from "../types/monitoring";

interface OverviewCardsProps {
  overview: SystemOverview;
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  const cards = [
    { label: "Total devices", value: overview.totalDevices, tone: "neutral" },
    { label: "OK", value: overview.okDevices, tone: "ok" },
    { label: "Warnings", value: overview.warningDevices, tone: "warning" },
    {
      label: "Critical / Offline",
      value: overview.criticalOrOfflineDevices,
      tone: "critical",
    },
  ] as const;

  return (
    <section className="panel">
      <h2 className="panel-title">System Overview</h2>
      <div className="overview-grid">
        {cards.map((card) => (
          <article key={card.label} className={`stat-card stat-${card.tone}`}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
