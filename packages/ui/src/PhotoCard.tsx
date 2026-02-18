import { ReactNode } from "react";

interface PhotoCardProps {
  imageSlot: ReactNode;
  overlaySlot?: ReactNode;
  captionSlot?: ReactNode;
  aspectRatio: number;
  className?: string;
}

export function PhotoCard({
  imageSlot,
  overlaySlot,
  captionSlot,
  aspectRatio,
  className,
}: PhotoCardProps) {
  return (
    <figure className={className}>
      <div className="group relative overflow-hidden rounded-lg bg-card-bg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-out">
        <div
          className="relative"
          style={{
            aspectRatio: `${aspectRatio}`,
          }}
        >
          {imageSlot}
        </div>

        {overlaySlot}
      </div>

      {captionSlot}
    </figure>
  );
}
