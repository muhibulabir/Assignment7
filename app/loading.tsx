import { ProductSkeleton } from "@/components/product-skeleton";

export default function Loading() {
  return (
    <div className="container-shell section-space">
      <div className="skeleton mb-6 h-10 w-56" />
      <ProductSkeleton />
    </div>
  );
}
