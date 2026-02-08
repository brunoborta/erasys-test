interface StatCardProps {
  value: number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="rounded-lg bg-card-bg px-6 py-4 shadow-md hover:bg-card-hover transition-colors duration-300">
      <p className="text-2xl font-bold text-foreground">
        {value}
      </p>
      <p className="text-sm text-foreground-secondary">
        {label}
      </p>
    </div>
  );
}
