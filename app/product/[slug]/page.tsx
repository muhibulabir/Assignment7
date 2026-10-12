import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MarketDataError } from "@/components/market-data-error";
import { ApiRequestError, getProduct, getProductDescription } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { formatPrice, formatUnit, toBengaliDigits } from "@/lib/format";
import type { Product } from "@/types/bazardor";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: Product | null;
  try {
    product = await getProduct(slug);
  } catch (error) {
    if (error instanceof ApiRequestError) return <MarketDataError />;
    throw error;
  }
  if (!product) notFound();

  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/signin?reason=protected&callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const prices = product.markets.flatMap((market) => [market.min, market.max]);
  const minimum = prices.length ? Math.min(...prices) : product.today;
  const maximum = prices.length ? Math.max(...prices) : product.today;
  const average =
    product.markets.length > 0
      ? product.markets.reduce((sum, market) => sum + (market.min + market.max) / 2, 0) /
        product.markets.length
      : product.today;

  const changeColor =
    product.change.dir === "up"
      ? "text-[#d35f4b]"
      : product.change.dir === "down"
        ? "text-[#34865a]"
        : "text-[#78847b]";

  return (
    <article className="container-shell max-w-5xl py-6">
      <div className="mb-4 text-sm text-[#718077]">
        <Link href="/" className="hover:text-leaf">হোম</Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/category/${product.category}`} className="hover:text-leaf">{product.categoryNameBn}</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.nameBn}</span>
      </div>

      <section className="design-surface flex flex-col justify-between gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#f1f5f1] text-3xl" aria-hidden="true">
            {product.image || product.categoryIcon}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-ink">{product.nameBn}</h1>
            <p className="text-xs text-[#6f7b72]">{product.categoryNameBn} · {formatUnit(product.unit)}</p>
            <p className="mt-1 text-xs text-[#35453a]">{getProductDescription(product)}</p>
          </div>
        </div>
        <div className="shrink-0 rounded-xl bg-[#f1f5f1] px-4 py-2 text-center sm:min-w-24">
          <p className="text-xs text-[#6f7b72]">আজকের দাম</p>
          <p className="text-xl font-bold leading-6 text-ink">{formatPrice(product.today)}</p>
          <p className="text-[10px] text-[#6f7b72]">{formatUnit(product.unit)}</p>
          <p className={`text-[10px] font-bold ${changeColor}`}>
            {product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"}
            {" "}{toBengaliDigits(Math.abs(product.change.pct).toFixed(1))}%
          </p>
        </div>
      </section>

      <section className="design-surface mt-4 rounded-xl p-4 sm:p-5">
        <h2 className="mb-3 font-bold text-ink">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { label: "সর্বনিম্ন দাম", value: minimum, note: "সবচেয়ে কম দামের বাজার", color: "text-[#008b45]" },
            { label: "সর্বাধিক দাম", value: maximum, note: "সবচেয়ে বেশি দামের বাজার", color: "text-[#d35f4b]" },
            { label: "গড় দাম", value: average, note: `${formatUnit(product.unit)}-এর হিসাবে`, color: "text-[#008b45]" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[#e1e8e1] bg-[#fafcfa] px-3 py-2">
              <p className="text-xs text-[#6f7b72]">{item.label}</p>
              <p className={`text-lg font-bold leading-6 ${item.color}`}>{formatPrice(item.value)}</p>
              <p className="text-[10px] text-[#879188]">{item.note}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-2 mt-4 font-bold text-ink">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto rounded-xl border border-[#e1e8e1] bg-[#fafcfa]">
          <table className="table table-sm min-w-[640px]">
            <thead>
              <tr className="text-[#6f7b72]">
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th className="text-right">সর্বনিম্ন</th>
                <th className="text-right">সর্বাধিক</th>
                <th className="text-right">গড়</th>
              </tr>
            </thead>
            <tbody>
              {product.markets.map((market) => (
                <tr key={`${market.market}-${market.division}`}>
                  <td className="font-semibold text-ink">{market.market}</td>
                  <td className="text-[#6f7b72]">{market.division}</td>
                  <td className="text-right">{formatPrice(market.min)}</td>
                  <td className="text-right">{formatPrice(market.max)}</td>
                  <td className="text-right font-semibold text-leaf">{formatPrice((market.min + market.max) / 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
