import Link from 'next/link'
import { Suspense } from 'react'
import { getProjects } from '@/lib/actions/project'
import ProjectsTable from './_components/ProjectsTable'
import { ProjectsTableSkeleton } from './_components/ProjectsTableSkeleton'

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
            Projets
          </h1>
          <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
            Gérez vos projets de portfolio
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center px-5 py-3 bg-primary/90 backdrop-blur-sm text-background font-mono text-xs uppercase tracking-widest hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-lg"
        >
          + Nouveau projet
        </Link>
      </div>

      {/* Projects Table */}
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <ProjectsTableContent />
      </Suspense>
    </div>
  )
}

async function ProjectsTableContent() {
  const projects = await getProjects()
  return <ProjectsTable projects={projects} />
}
