import { ProductSkeleton } from "@/components/product-skeleton";

export default function CategoryLoading() {
  return (
    <section className="container-shell section-space">
      <div className="skeleton mb-8 h-40 rounded-[28px]" />
      <ProductSkeleton />
    </section>
  );
}
