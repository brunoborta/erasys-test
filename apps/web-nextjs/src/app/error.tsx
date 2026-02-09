"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-background-secondary">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
        <p className="text-foreground-secondary">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-card-bg border border-border text-foreground hover:bg-card-hover transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
