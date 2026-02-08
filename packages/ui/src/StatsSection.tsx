import { StatCard } from './StatCard';

interface StatsSectionProps {
  publicCount: number;
  totalCount: number;
}

export function StatsSection({ publicCount, totalCount }: StatsSectionProps) {
  return (
    <section 
      className="mt-12 flex justify-center gap-8 text-center"
      aria-label="Photo Gallery Statistics"
    >
      <StatCard value={publicCount} label="Public Photos" />
      <StatCard value={totalCount} label="Total Photos" />
    </section>
  );
}
