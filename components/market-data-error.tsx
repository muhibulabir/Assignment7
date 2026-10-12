"use client";

import Link from "next/link";

interface MarketDataErrorProps {
  onRetry?: () => void;
}

export function MarketDataError({ onRetry }: MarketDataErrorProps) {
  return (
    <section className="container-shell grid min-h-[65vh] place-items-center px-4 py-16">
      <div className="max-w-lg text-center">
        <span className="text-5xl" aria-hidden="true">🌐</span>
        <h1 className="mt-5 text-2xl font-bold text-ink">তথ্য লোড করা যায়নি</h1>
        <p className="mt-2 text-sm leading-6 text-[#6f7b72]">
          বাজারের তথ্য আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন, অথবা হোম পেজে ফিরে যান।
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn btn-primary rounded-lg"
            onClick={onRetry ?? (() => window.location.reload())}
          >
            আবার চেষ্টা করুন
          </button>
          <Link href="/" className="btn btn-outline rounded-lg">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </section>
  );
}
