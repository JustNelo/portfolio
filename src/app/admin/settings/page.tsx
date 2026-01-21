export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-primary uppercase tracking-tight">
          Paramètres
        </h1>
        <p className="font-mono text-sm text-muted mt-1">
          Configuration de votre portfolio
        </p>
      </div>

      {/* Settings sections */}
      <div className="grid gap-6 max-w-2xl">
        {/* Profile */}
        <section className="bg-card border border-border-medium p-6 space-y-4">
          <h2 className="font-mono text-xs text-muted uppercase tracking-widest">
            Profil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Nom d&apos;affichage
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full bg-background border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors"
                disabled
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full bg-background border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors"
                disabled
              />
            </div>
          </div>
          <p className="font-mono text-[10px] text-muted/60">
            La modification du profil sera disponible dans une prochaine version.
          </p>
        </section>

        {/* Danger Zone */}
        <section className="bg-card border border-red-500/30 p-6 space-y-4">
          <h2 className="font-mono text-xs text-red-500 uppercase tracking-widest">
            Zone dangereuse
          </h2>
          <div className="space-y-2">
            <p className="font-mono text-sm text-muted">
              Supprimer tous les projets et médias
            </p>
            <button
              className="px-4 py-2 border border-red-500/30 font-mono text-xs text-red-500 uppercase tracking-widest hover:bg-red-500/10 transition-colors"
              disabled
            >
              Supprimer tout
            </button>
          </div>
          <p className="font-mono text-[10px] text-muted/60">
            Cette action est irréversible et sera disponible dans une prochaine version.
          </p>
        </section>
      </div>
    </div>
  )
}
