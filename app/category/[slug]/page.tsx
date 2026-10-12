import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketDataError } from "@/components/market-data-error";
import { ProductGrid } from "@/components/product-grid";
import { ApiRequestError, getCategory, getProducts } from "@/lib/api";
import type { Category, Product } from "@/types/bazardor";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let category: Category | null;
  try {
    category = await getCategory(slug);
  } catch (error) {
    if (error instanceof ApiRequestError) return <MarketDataError />;
    throw error;
  }

  if (!category) notFound();
  let products: Product[];
  try {
    products = await getProducts(category.slug);
  } catch (error) {
    if (error instanceof ApiRequestError) return <MarketDataError />;
    throw error;
  }

  return (
    <section className="container-shell min-h-[65vh] py-8">
      <div className="flex items-center gap-3 px-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f1f5f1] text-2xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-ink">{category.nameBn}</h1>
          <p className="mt-0.5 text-sm text-[#6f7b72]">
            {`${products.length}টি পণ্যের আজকের দাম ও পরিবর্তন`}
          </p>
        </div>
      </div>
      <div className="mt-14">
        <div className="mb-3 px-4 text-sm text-[#6f7b72]">
          <Link href="/" className="hover:text-leaf">হোম</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          {category.nameBn}
        </div>
        <ProductGrid products={products} showHomeLink />
      </div>
    </section>
  );
}
