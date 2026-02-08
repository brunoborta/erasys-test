import Image from 'next/image';
import type { Picture } from '@borta/user-pictures';

interface PhotoCardProps {
  picture: Picture;
  imageUrl: string;
  profileName: string;
  index: number;
}

export function PhotoCard({ picture, imageUrl, profileName, index }: PhotoCardProps) {
  const altText = `Photo by ${profileName} - ${picture.width}x${picture.height} pixels, rating ${picture.rating}`;
  
  return (
    <>
      <div className="group relative overflow-hidden rounded-lg bg-card-bg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-out">
        <div 
          className="relative" 
          style={{ 
            aspectRatio: `${picture.width} / ${picture.height}` 
          }}
        >
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 380px"
            quality={80}
            priority={index < 4}
            fetchPriority={index < 4 ? "high" : "auto"}
            loading={index < 4 ? "eager" : "lazy"}
          />
        </div>
        
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out">
          <p className="text-xs text-white font-medium">
            {picture.width} × {picture.height}
          </p>
          <p className="text-xs text-zinc-300">
            Rating: {picture.rating}
          </p>
        </div>
      </div>
      
      <figcaption className="sr-only">
        Photo {index + 1} by {profileName}, dimensions {picture.width} by {picture.height} pixels
      </figcaption>
    </>
  );
}
