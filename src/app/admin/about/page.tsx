import { getProfile, getSocials, getSkills, getTimeline } from '@/lib/actions/about'
import ProfileForm from '../settings/_components/ProfileForm'
import SocialsManager from '../settings/_components/SocialsManager'
import SkillsManager from '../settings/_components/SkillsManager'
import TimelineManager from '../settings/_components/TimelineManager'

export default async function AdminAboutPage() {
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
          Section À Propos
        </h1>
        <p className="font-mono text-xs lg:text-sm text-white/50 mt-1">
          Gérez votre profil, compétences et parcours
        </p>
      </div>

      {/* Grid layout for cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Profile - Full width */}
        <section className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-mono text-sm text-white/80 uppercase tracking-widest">
              Informations personnelles
            </h2>
          </div>
          <ProfileForm profile={profile} />
        </section>

        {/* Socials */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h2 className="font-mono text-sm text-white/80 uppercase tracking-widest">
              Liens sociaux
            </h2>
          </div>
          <SocialsManager initialSocials={socials} />
        </section>

        {/* Skills */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="font-mono text-sm text-white/80 uppercase tracking-widest">
              Compétences
            </h2>
          </div>
          <SkillsManager initialSkills={skills} />
        </section>

        {/* Timeline - Full width */}
        <section className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-mono text-sm text-white/80 uppercase tracking-widest">
              Parcours
            </h2>
          </div>
          <TimelineManager initialTimeline={timeline} />
        </section>
      </div>
    </div>
  )
}
