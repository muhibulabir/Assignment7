import { formatPrice, formatUnit, toBengaliDigits } from "@/lib/format";
import type { Product } from "@/types/bazardor";

interface PriceTickerProps {
  products: Product[];
}

export function PriceTicker({ products }: PriceTickerProps) {
  const items = products.slice(0, 16);
  if (items.length === 0) return null;

  return (
    <div className="flex h-[37px] items-center overflow-hidden border-b border-[#e1e8e1] bg-[#f4f7f4]" aria-label="আজকের বাজারদর">
      <div className="ticker-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div className="flex shrink-0 items-center" key={copy} aria-hidden={copy === 1}>
            {items.map((product) => (
              <span key={`${copy}-${product.id}`} className="mx-4 flex items-center gap-2 whitespace-nowrap text-xs text-[#35453a] sm:text-sm">
                <span aria-hidden="true">{product.image || product.categoryIcon}</span>
                <span className="font-semibold text-ink">{product.nameBn}</span>
                <span className="text-[#6f7b72]">দাম {formatPrice(product.today)}/{formatUnit(product.unit).replace(/^প্রতি\s*/, "")}</span>
                <span className={product.change.dir === "up" ? "font-bold text-[#34865a]" : product.change.dir === "down" ? "font-bold text-[#d35f4b]" : "text-[#849087]"}>
                  {product.change.dir === "up" ? "▲ " : product.change.dir === "down" ? "▼ " : "—"}
                  {toBengaliDigits(Math.abs(product.change.pct).toFixed(1))}%
                </span>
                <span className="ml-2 text-[#b8c2ba]" aria-hidden="true">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
