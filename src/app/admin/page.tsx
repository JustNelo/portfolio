import Link from 'next/link'
import { getProjectsFull } from '@/lib/actions/project'

export default async function AdminDashboardPage() {
  const projects = await getProjectsFull()

  const stats = {
    totalProjects: projects.length,
    totalMedias: projects.reduce((acc, p) => acc + p.project_medias.length, 0),
    latestProject: projects[0]?.title || 'Aucun projet',
    categories: [...new Set(projects.map((p) => p.category))].length,
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
            Vue d&apos;ensemble
          </h1>
          <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
            Tableau de bord de votre portfolio
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center px-5 py-3 bg-primary/90 backdrop-blur-sm text-background font-mono text-xs uppercase tracking-widest hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-lg"
        >
          + Nouveau projet
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Projets" value={stats.totalProjects} />
        <StatCard label="Médias" value={stats.totalMedias} />
        <StatCard label="Catégories" value={stats.categories} />
        <StatCard label="Dernier projet" value={stats.latestProject} isText />
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg lg:text-xl text-primary uppercase tracking-tight drop-shadow-md">
          Projets récents
        </h2>
        {projects.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
            <p className="font-mono text-sm text-white/60">Aucun projet pour le moment</p>
            <Link
              href="/admin/projects/new"
              className="inline-block mt-4 font-mono text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Créer votre premier projet →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="aspect-video bg-black/30 rounded-lg mb-4 overflow-hidden">
                  {project.project_medias[0] ? (
                    <img
                      src={project.project_medias[0].url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-xs text-white/30">No media</span>
                    </div>
                  )}
                </div>
                <h3 className="font-mono text-sm text-white/90 group-hover:text-primary transition-colors truncate">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase">
                    {project.category}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono text-[10px] text-white/40">{project.year}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  isText = false,
}: {
  label: string
  value: number | string
  isText?: boolean
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 lg:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
      <p className="font-mono text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest">{label}</p>
      <p
        className={`mt-1 lg:mt-2 ${
          isText
            ? 'font-mono text-xs lg:text-sm text-white/80 truncate'
            : 'font-heading text-2xl lg:text-3xl text-primary group-hover:drop-shadow-lg transition-all'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
