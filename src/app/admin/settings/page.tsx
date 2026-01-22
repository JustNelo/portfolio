export default async function AdminSettingsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
          Paramètres
        </h1>
        <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
          Configuration générale de l&apos;application
        </p>
      </div>

      {/* Settings sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-4xl">
        {/* Cache & Performance */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-mono text-sm text-white/80 uppercase tracking-widest">
              Cache & Performance
            </h2>
          </div>
          <p className="font-mono text-xs text-white/50">
            Gérez le cache et optimisez les performances de votre site.
          </p>
          <button
            className="px-4 py-2.5 border border-white/20 rounded-lg font-mono text-xs text-white/60 uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
          >
            Vider le cache
          </button>
        </section>

        {/* SEO */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="font-mono text-sm text-white/80 uppercase tracking-widest">
              SEO & Métadonnées
            </h2>
          </div>
          <p className="font-mono text-xs text-white/50">
            Configuration du référencement et des métadonnées.
          </p>
          <p className="font-mono text-[10px] text-white/30 italic">
            Bientôt disponible
          </p>
        </section>

        {/* Danger Zone - Full width */}
        <section className="lg:col-span-2 bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-mono text-sm text-red-400 uppercase tracking-widest">
              Zone dangereuse
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="font-mono text-sm text-white/60">
                Supprimer tous les projets et médias
              </p>
              <button
                className="px-4 py-2.5 border border-red-500/30 rounded-lg font-mono text-xs text-red-400/50 uppercase tracking-widest cursor-not-allowed"
                disabled
              >
                Supprimer tout
              </button>
            </div>
            <div className="space-y-3">
              <p className="font-mono text-sm text-white/60">
                Réinitialiser les paramètres par défaut
              </p>
              <button
                className="px-4 py-2.5 border border-red-500/30 rounded-lg font-mono text-xs text-red-400/50 uppercase tracking-widest cursor-not-allowed"
                disabled
              >
                Réinitialiser
              </button>
            </div>
          </div>
          <p className="font-mono text-[10px] text-white/30">
            Ces actions sont irréversibles et seront disponibles dans une prochaine version.
          </p>
        </section>
      </div>
    </div>
  )
}
