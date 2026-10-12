"use client";

import { MarketDataError } from "@/components/market-data-error";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <MarketDataError onRetry={reset} />;
}
