export function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="পণ্য লোড হচ্ছে">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="flex h-[138px] flex-col justify-between rounded-xl border border-[#e1e8e1] bg-[#fafcfa] p-4" key={index}>
          <div className="flex items-center gap-3">
            <div className="skeleton h-10 w-10 rounded-lg" />
            <div>
              <div className="skeleton h-4 w-32" />
              <div className="skeleton mt-2 h-3 w-20" />
            </div>
          </div>
          <div className="skeleton h-5 w-24" />
        </div>
      ))}
    </div>
  );
}
