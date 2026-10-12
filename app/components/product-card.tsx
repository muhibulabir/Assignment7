import Link from "next/link";
import { formatPrice, formatUnit, toBengaliDigits } from "@/lib/format";
import type { Product } from "@/types/bazardor";

export function ProductCard({ product }: { product: Product }) {
  const direction = product.change.dir;
  const changeLabel =
    direction === "same"
      ? "—০.০%"
      : `${direction === "up" ? "▲" : "▼"} ${toBengaliDigits(Math.abs(product.change.pct).toFixed(1))}%`;
  const changeColor =
    direction === "up" ? "text-[#34865a]" : direction === "down" ? "text-[#d35f4b]" : "text-[#78847b]";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-[138px] flex-col justify-between rounded-xl border border-[#e1e8e1] bg-[#fafcfa] p-4 transition-colors hover:border-leaf/50 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf"
      aria-label={`${product.nameBn}, ${formatPrice(product.today)}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f1f5f1] text-2xl" aria-hidden="true">
          {product.image || product.categoryIcon}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-ink">{product.nameBn}</h3>
          <p className="mt-0.5 text-xs text-[#6f7b72]">{formatUnit(product.unit)}</p>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[#6f7b72]">আজকের দাম</p>
          <p className="mt-0.5 text-lg font-bold leading-6 text-ink">{formatPrice(product.today)}</p>
        </div>
        <span className={`mb-1 whitespace-nowrap text-xs font-bold ${changeColor}`}>
          {changeLabel}
        </span>
      </div>
    </Link>
  );
}
