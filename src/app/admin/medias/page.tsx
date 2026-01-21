import Link from 'next/link'

export default function AdminMediasPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary uppercase tracking-tight">
            Médias
          </h1>
          <p className="font-mono text-sm text-muted mt-1">
            Gérez vos fichiers médias
          </p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="bg-card border border-border-medium p-12 text-center">
        <div className="space-y-4">
          <svg
            className="w-12 h-12 mx-auto text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="font-mono text-sm text-muted">
            La gestion centralisée des médias arrive bientôt
          </p>
          <p className="font-mono text-xs text-muted/60">
            En attendant, gérez vos médias directement depuis chaque projet
          </p>
          <Link
            href="/admin/projects"
            className="inline-block mt-4 font-mono text-xs text-primary hover:underline"
          >
            Voir les projets →
          </Link>
        </div>
      </div>
    </div>
  )
}
