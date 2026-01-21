import Link from 'next/link'
import { getProjects } from '@/lib/actions/project'

export default async function AdminDashboardPage() {
  const projects = await getProjects()

  const stats = {
    totalProjects: projects.length,
    totalMedias: projects.reduce((acc, p) => acc + p.project_medias.length, 0),
    latestProject: projects[0]?.title || 'Aucun projet',
    categories: [...new Set(projects.map((p) => p.category))].length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary uppercase tracking-tight">
            Vue d&apos;ensemble
          </h1>
          <p className="font-mono text-sm text-muted mt-1">
            Tableau de bord de votre portfolio
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-6 py-3 bg-primary text-background font-mono text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          + Nouveau projet
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projets" value={stats.totalProjects} />
        <StatCard label="Médias" value={stats.totalMedias} />
        <StatCard label="Catégories" value={stats.categories} />
        <StatCard label="Dernier projet" value={stats.latestProject} isText />
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl text-primary uppercase tracking-tight">
          Projets récents
        </h2>
        {projects.length === 0 ? (
          <div className="bg-card border border-border-medium p-8 text-center">
            <p className="font-mono text-sm text-muted">Aucun projet pour le moment</p>
            <Link
              href="/admin/projects/new"
              className="inline-block mt-4 font-mono text-xs text-primary hover:underline"
            >
              Créer votre premier projet →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group bg-card border border-border-medium p-4 hover:border-primary/50 transition-colors"
              >
                <div className="aspect-video bg-background/50 mb-4 overflow-hidden">
                  {project.project_medias[0] ? (
                    <img
                      src={project.project_medias[0].url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-xs text-muted">No media</span>
                    </div>
                  )}
                </div>
                <h3 className="font-mono text-sm text-primary group-hover:text-primary/80 transition-colors truncate">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-[10px] text-muted uppercase">
                    {project.category}
                  </span>
                  <span className="text-muted">·</span>
                  <span className="font-mono text-[10px] text-muted">{project.year}</span>
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
    <div className="bg-card border border-border-medium p-6">
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{label}</p>
      <p
        className={`mt-2 ${
          isText
            ? 'font-mono text-sm text-primary truncate'
            : 'font-heading text-3xl text-primary'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
