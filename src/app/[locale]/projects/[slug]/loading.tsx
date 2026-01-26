export default function ProjectDetailLoading() {
  return (
    <main className="relative min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left column skeleton */}
        <aside className="lg:fixed lg:top-0 lg:left-0 lg:w-[40%] xl:w-[35%] lg:h-screen p-6 sm:p-8 lg:p-10 xl:p-14">
          <div className="pt-8 lg:pt-0">
            {/* Title skeleton */}
            <div className="h-12 sm:h-16 lg:h-20 w-3/4 bg-card/50 animate-pulse rounded" />
            
            {/* Description skeleton */}
            <div className="mt-6 lg:mt-10 space-y-2">
              <div className="h-3 w-full bg-card/30 animate-pulse rounded" />
              <div className="h-3 w-5/6 bg-card/30 animate-pulse rounded" />
              <div className="h-3 w-4/6 bg-card/30 animate-pulse rounded" />
            </div>

            {/* Metadata skeleton */}
            <div className="mt-8 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-3 bg-card/20 animate-pulse rounded" />
                  <div className="w-32 h-3 bg-card/30 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right column - media gallery skeleton */}
        <div className="lg:ml-[40%] xl:ml-[35%] flex-1 p-4 sm:p-6 lg:p-6 xl:p-8">
          <div className="space-y-4 lg:space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="relative aspect-16/10 bg-card/40 animate-pulse rounded"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
