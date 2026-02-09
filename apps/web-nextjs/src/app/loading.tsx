export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background-secondary">
      <div className="container mx-auto px-4 py-12">
        {/* Profile header skeleton */}
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 w-64 mx-auto rounded bg-card-bg animate-pulse" />
          <div className="h-6 w-96 mx-auto rounded bg-card-bg animate-pulse" />
          <div className="h-4 w-32 mx-auto rounded bg-card-bg animate-pulse" />
        </div>

        {/* Photo grid skeleton */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 break-inside-avoid rounded-xl bg-card-bg animate-pulse"
              style={{ aspectRatio: `${3 + (i % 3)} / 4` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
