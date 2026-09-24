"use client";

import { useEffect, useState } from "react";

type FakeProgressProps = {
  active: boolean;
};

export const FakeProgress = ({ active }: FakeProgressProps) => {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!active) {
      setElapsedMs(0);
      return;
    }

    const startedAt = Date.now();
    setElapsedMs(0);

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 100);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-500">
      <span className="size-1.5 animate-pulse rounded-full bg-zinc-400" />
      Generating image... {(elapsedMs / 1000).toFixed(1)}s
    </div>
  );
};
