export default function ProductLoading() {
  return (
    <div className="container-shell section-space">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="skeleton h-[420px] rounded-[28px]" />
        <div className="space-y-5">
          <div className="skeleton h-12 w-2/3" />
          <div className="skeleton h-28 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
