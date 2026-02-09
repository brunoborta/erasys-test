import { StatCard } from "./StatCard";

interface StatsSectionProps {
  stats: { value: number; label: string }[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section
      className="mt-12 flex justify-center gap-8 text-center"
      aria-label="Photo Gallery Statistics"
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} value={stat.value} label={stat.label} />
      ))}
    </section>
  );
}
