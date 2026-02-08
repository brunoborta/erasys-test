import { StatCard } from '@/components/ui/StatCard';

interface StatsSectionProps {
  publicCount: number;
  totalCount: number;
}

export function StatsSection({ publicCount, totalCount }: StatsSectionProps) {
  return (
    <div className="mt-12 flex justify-center gap-8 text-center">
      <StatCard value={publicCount} label="Public Photos" />
      <StatCard value={totalCount} label="Total Photos" />
    </div>
  );
}
