import { Hero } from "@/components/hero";
import { MarketDataError } from "@/components/market-data-error";
import { ProductCard } from "@/components/product-card";
import { ProductGrid } from "@/components/product-grid";
import { ApiRequestError, getProducts } from "@/lib/api";
import type { Product } from "@/types/bazardor";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[];
  try {
    products = await getProducts();
  } catch (error) {
    if (error instanceof ApiRequestError) return <MarketDataError />;
    throw error;
  }
  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => Number(b.change.pct) - Number(a.change.pct))
    .slice(0, 6);
  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => Number(a.change.pct) - Number(b.change.pct))
    .slice(0, 6);

  return (
    <>
      <Hero />

      <section id="আজ-দাম-বেড়েছে" className="container-shell mt-10 px-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
          <span className="text-[#34865a]" aria-hidden="true">▲</span> আজ দাম বেড়েছে
        </h2>
        {risers.length ? (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {risers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-[#e1e8e1] bg-[#fafcfa] p-5 text-sm text-[#6f7b72]">আজ কোনো পণ্যের দাম বাড়ার তথ্য নেই।</p>
        )}
      </section>

      <section className="container-shell mt-10 px-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
          <span className="text-[#d35f4b]" aria-hidden="true">▼</span> আজ দাম কমেছে
        </h2>
        {fallers.length ? (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-[#e1e8e1] bg-[#fafcfa] p-5 text-sm text-[#6f7b72]">আজ কোনো পণ্যের দাম কমার তথ্য নেই।</p>
        )}
      </section>

      <section id="সব-পণ্য" className="container-shell mt-10 px-4 pb-10">
        <h2 className="text-xl font-bold text-ink">সব পণ্য</h2>
        <p className="mt-1 text-sm text-[#6f7b72]">
          প্রতিটি পণ্যের আজকের দাম ও বাজারের পরিবর্তন এক নজরে দেখুন।
        </p>
        <ProductGrid products={products} />
      </section>
    </>
  );
}
