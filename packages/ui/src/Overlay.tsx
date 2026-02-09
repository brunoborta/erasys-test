import { ReactNode } from "react";

interface OverlayProps {
  title?: ReactNode;
  subtitle?: ReactNode;
}

export function Overlay({ title, subtitle }: OverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out">
      {title && <div className="text-xs text-white font-medium">{title}</div>}
      {subtitle && <div className="text-xs text-zinc-300">{subtitle}</div>}
    </div>
  );
}
