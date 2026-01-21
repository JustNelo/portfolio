import Link from 'next/link'

export default function AdminMediasPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
          Médias
        </h1>
        <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
          Gérez vos fichiers médias
        </p>
      </div>

      {/* Coming soon */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-10 lg:p-16 text-center">
        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
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
          </div>
          <h2 className="font-mono text-lg text-white/80">
            Bientôt disponible
          </h2>
          <p className="font-mono text-sm text-white/50">
            La gestion centralisée des médias arrive bientôt
          </p>
          <p className="font-mono text-xs text-white/30">
            En attendant, gérez vos médias directement depuis chaque projet
          </p>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg font-mono text-xs text-primary hover:bg-primary/20 transition-all"
          >
            Voir les projets
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
