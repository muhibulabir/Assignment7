"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { bengaliToNumber } from "@/lib/format";
import type { Product } from "@/types/bazardor";
import { ProductCard } from "./product-card";

type SortOrder = "default" | "ascending" | "descending";

interface ProductGridProps {
  products: Product[];
  showHomeLink?: boolean;
}

export function ProductGrid({ products, showHomeLink = false }: ProductGridProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const sortedProducts = useMemo(() => {
    if (sortOrder === "default") return products;
    return [...products].sort((a, b) => {
      const difference = bengaliToNumber(a.today) - bengaliToNumber(b.today);
      return sortOrder === "ascending" ? difference : -difference;
    });
  }, [products, sortOrder]);

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-[#6f7b72]">{`মোট ${products.length}টি পণ্য দেখানো হচ্ছে`}</p>
        <label className="flex items-center gap-2 text-sm font-semibold text-[#58665d]">
          সাজান
          <select
            className="select select-bordered select-sm rounded-full bg-white"
            aria-label="পণ্যের দাম অনুযায়ী সাজান"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            <option value="default">ডিফল্ট</option>
            <option value="ascending">দাম: কম থেকে বেশি</option>
            <option value="descending">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>
      {sortedProducts.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-[#e1e8e1] bg-[#fafcfa] px-5 py-12 text-center">
          <span className="text-4xl" aria-hidden="true">🧺</span>
          <p className="mt-3 font-semibold text-ink">এখনো কোনো পণ্য নেই।</p>
          {showHomeLink && (
            <Link href="/" className="btn btn-primary btn-sm mt-4 rounded-lg">
              হোম পেজে ফিরে যান
            </Link>
          )}
        </div>
      )}
    </>
  );
}
