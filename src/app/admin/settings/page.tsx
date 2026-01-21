export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
          Paramètres
        </h1>
        <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
          Configuration de votre portfolio
        </p>
      </div>

      {/* Settings sections */}
      <div className="grid gap-4 lg:gap-6 max-w-2xl">
        {/* Profile */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <h2 className="font-mono text-xs text-white/60 uppercase tracking-widest">
            Profil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
                Nom d&apos;affichage
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/40 focus:outline-none transition-colors cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/40 focus:outline-none transition-colors cursor-not-allowed"
                disabled
              />
            </div>
          </div>
          <p className="font-mono text-[10px] text-white/30">
            La modification du profil sera disponible dans une prochaine version.
          </p>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-xl p-5 lg:p-6 space-y-4">
          <h2 className="font-mono text-xs text-red-400 uppercase tracking-widest">
            Zone dangereuse
          </h2>
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
          <p className="font-mono text-[10px] text-white/30">
            Cette action est irréversible et sera disponible dans une prochaine version.
          </p>
        </section>
      </div>
    </div>
  )
}
