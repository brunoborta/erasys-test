import type { ReactNode } from "react";

type MasonryGridProps = {
  children: ReactNode;
  className?: string;
};

export function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div
      className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
