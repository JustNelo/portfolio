export function ProjectsTableSkeleton() {
  return (
    <div className="bg-card border border-border-medium overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-medium">
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest">
              Projet
            </th>
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest hidden md:table-cell">
              Catégorie
            </th>
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest hidden lg:table-cell">
              Année
            </th>
            <th className="text-left p-4 font-mono text-[10px] text-muted uppercase tracking-widest hidden sm:table-cell">
              Médias
            </th>
            <th className="text-right p-4 font-mono text-[10px] text-muted uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-border-medium last:border-0">
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 bg-border-medium animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-border-medium animate-pulse" />
                    <div className="w-20 h-3 bg-border-medium animate-pulse" />
                  </div>
                </div>
              </td>
              <td className="p-4 hidden md:table-cell">
                <div className="w-20 h-4 bg-border-medium animate-pulse" />
              </td>
              <td className="p-4 hidden lg:table-cell">
                <div className="w-12 h-4 bg-border-medium animate-pulse" />
              </td>
              <td className="p-4 hidden sm:table-cell">
                <div className="w-16 h-4 bg-border-medium animate-pulse" />
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-8 h-8 bg-border-medium animate-pulse" />
                  <div className="w-8 h-8 bg-border-medium animate-pulse" />
                  <div className="w-8 h-8 bg-border-medium animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
