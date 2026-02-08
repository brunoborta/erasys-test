'use client';

import Masonry from 'react-masonry-css';
import './masonry-grid.css';

interface MasonryGridProps {
  children: React.ReactNode;
}

export function MasonryGrid({ children }: MasonryGridProps) {
  const breakpointColumns = {
    default: 4,  // Large Desktop
    1280: 3,     // Desktop
    1024: 2,     // Tablet
    640: 1,      // Mobile
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {children}
    </Masonry>
  );
}
