import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/actions/project'
import ProjectForm from '../../_components/ProjectForm'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
            Éditer le projet
          </h1>
          <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">{project.title}</p>
        </div>
        <div className="flex items-center gap-3 lg:gap-4">
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg font-mono text-xs text-white/60 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-white/50 hover:text-primary transition-colors uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ProjectForm mode="edit" project={project} />
      </div>
    </div>
  )
}
