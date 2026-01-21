import Link from 'next/link'
import ProjectForm from '../../_components/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
            Nouveau projet
          </h1>
          <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
            Créez un nouveau projet pour votre portfolio
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-white/50 hover:text-primary transition-colors uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux projets
        </Link>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ProjectForm mode="create" />
      </div>
    </div>
  )
}
