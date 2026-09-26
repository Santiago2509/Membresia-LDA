export default function AulaLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-10 animate-pulse">
      {/* Welcome Banner skeleton */}
      <div className="rounded-3xl bg-primary/20 h-48 w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Content cards skeleton */}
          <div className="rounded-2xl bg-surface-container h-64 w-full" />
          <div className="rounded-2xl bg-surface-container h-48 w-full" />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-surface-container h-40 w-full" />
          <div className="rounded-2xl bg-surface-container h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
