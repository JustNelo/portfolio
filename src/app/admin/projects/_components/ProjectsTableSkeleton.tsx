export function ProjectsTableSkeleton() {
  return (
    <>
      {/* Desktop Table Skeleton */}
      <div className="hidden lg:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Projet
              </th>
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Catégorie
              </th>
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Année
              </th>
              <th className="text-left p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Médias
              </th>
              <th className="text-right p-4 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 bg-white/10 rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
                      <div className="w-20 h-3 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="lg:hidden space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          >
            <div className="flex gap-4">
              <div className="w-20 h-14 sm:w-24 sm:h-16 bg-white/10 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-white/5 rounded animate-pulse" />
                <div className="flex gap-2 mt-2">
                  <div className="w-16 h-5 bg-white/5 rounded animate-pulse" />
                  <div className="w-10 h-5 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-white/5">
              <div className="w-16 h-8 bg-white/5 rounded-lg animate-pulse" />
              <div className="w-16 h-8 bg-white/5 rounded-lg animate-pulse" />
              <div className="w-16 h-8 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
