export default function ProjectsLoading() {
  return (
    <main className="relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header skeleton */}
        <header className="mb-12 sm:mb-20">
          <div className="h-16 sm:h-24 md:h-28 lg:h-32 w-3/4 bg-card/50 animate-pulse rounded" />
          <div className="h-4 w-48 bg-card/30 animate-pulse rounded mt-4" />
        </header>

        {/* Project list skeleton */}
        <nav className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-2">
              <div className="flex items-baseline gap-4">
                <div className="w-8 h-4 bg-card/30 animate-pulse rounded" />
                <div 
                  className="flex-1 h-10 sm:h-12 md:h-14 lg:h-16 bg-card/40 animate-pulse rounded"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
                <div className="w-24 h-4 bg-card/30 animate-pulse rounded hidden sm:block" />
              </div>
              <div className="h-px bg-border/50 mt-2 ml-12" />
            </div>
          ))}
        </nav>
      </div>
    </main>
  )
}
