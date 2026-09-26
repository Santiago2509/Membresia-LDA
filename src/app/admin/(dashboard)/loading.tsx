export default function AdminLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center pb-4">
        <div className="space-y-2">
          <div className="h-8 w-52 rounded-xl bg-surface-container" />
          <div className="h-4 w-72 rounded-lg bg-surface-container" />
        </div>
        <div className="h-10 w-64 rounded-full bg-surface-container" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-surface-container h-32" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl bg-surface-container h-64 w-full" />
    </div>
  );
}
