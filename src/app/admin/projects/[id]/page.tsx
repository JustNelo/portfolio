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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary uppercase tracking-tight">
            Éditer le projet
          </h1>
          <p className="font-mono text-sm text-muted mt-1">{project.title}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="font-mono text-xs text-muted hover:text-primary transition-colors uppercase tracking-widest"
          >
            Voir le projet ↗
          </Link>
          <Link
            href="/admin/projects"
            className="font-mono text-xs text-muted hover:text-primary transition-colors uppercase tracking-widest"
          >
            ← Retour aux projets
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
