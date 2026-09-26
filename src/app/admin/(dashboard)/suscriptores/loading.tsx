export default function SuscriptoresLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-xl bg-surface-container" />
        <div className="h-4 w-80 rounded-lg bg-surface-container" />
      </div>

      {/* Search bar */}
      <div className="h-11 w-full max-w-md rounded-full bg-surface-container" />

      {/* Table rows */}
      <div className="rounded-2xl overflow-hidden border border-outline-variant/30">
        <div className="h-12 bg-surface-container-highest/50" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-t border-outline-variant/20">
            <div className="w-10 h-10 rounded-full bg-surface-container" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-surface-container" />
              <div className="h-3 w-56 rounded bg-surface-container" />
            </div>
            <div className="h-6 w-20 rounded-full bg-surface-container" />
            <div className="h-8 w-24 rounded-xl bg-surface-container" />
          </div>
        ))}
      </div>
    </div>
  );
}
