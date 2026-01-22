import { getProfile, getSocials, getSkills, getTimeline } from '@/lib/actions/about'
import ProfileForm from './_components/ProfileForm'
import SocialsManager from './_components/SocialsManager'
import SkillsManager from './_components/SkillsManager'
import TimelineManager from './_components/TimelineManager'

export default async function AdminSettingsPage() {
  const [profile, socials, skills, timeline] = await Promise.all([
    getProfile(),
    getSocials(),
    getSkills(),
    getTimeline(),
  ])

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl text-primary uppercase tracking-tight drop-shadow-lg">
          Paramètres Généraux
        </h1>
        <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
          Gérez votre profil, compétences et parcours
        </p>
      </div>

      {/* Settings sections */}
      <div className="grid gap-4 lg:gap-6 max-w-3xl">
        {/* Profile */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <h2 className="font-mono text-xs text-white/60 uppercase tracking-widest">
            Informations personnelles
          </h2>
          <ProfileForm profile={profile} />
        </section>

        {/* Socials */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <h2 className="font-mono text-xs text-white/60 uppercase tracking-widest">
            Liens sociaux
          </h2>
          <SocialsManager initialSocials={socials} />
        </section>

        {/* Skills */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <h2 className="font-mono text-xs text-white/60 uppercase tracking-widest">
            Compétences
          </h2>
          <SkillsManager initialSkills={skills} />
        </section>

        {/* Timeline */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <h2 className="font-mono text-xs text-white/60 uppercase tracking-widest">
            Parcours
          </h2>
          <TimelineManager initialTimeline={timeline} />
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
