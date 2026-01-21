import Link from 'next/link'
import ProjectForm from '../../_components/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary uppercase tracking-tight">
            Nouveau projet
          </h1>
          <p className="font-mono text-sm text-muted mt-1">
            Créez un nouveau projet pour votre portfolio
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="font-mono text-xs text-muted hover:text-primary transition-colors uppercase tracking-widest"
        >
          ← Retour aux projets
        </Link>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ProjectForm mode="create" />
      </div>
    </div>
  )
}
