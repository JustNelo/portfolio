import Link from 'next/link'
import { Suspense } from 'react'
import { getProjects } from '@/lib/actions/project'
import ProjectsTable from './_components/ProjectsTable'
import { ProjectsTableSkeleton } from './_components/ProjectsTableSkeleton'

export default function AdminProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary uppercase tracking-tight">
            Projets
          </h1>
          <p className="font-mono text-sm text-muted mt-1">
            Gérez vos projets de portfolio
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-6 py-3 bg-primary text-background font-mono text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
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
