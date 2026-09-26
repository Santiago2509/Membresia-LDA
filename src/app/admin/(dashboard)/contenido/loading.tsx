export default function ContenidoLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-52 rounded-xl bg-surface-container" />
          <div className="h-4 w-72 rounded-lg bg-surface-container" />
        </div>
        <div className="h-11 w-40 rounded-full bg-surface-container" />
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-surface-container h-56" />
        ))}
      </div>
    </div>
  );
}
