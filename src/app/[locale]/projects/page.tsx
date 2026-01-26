import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/actions/project'
import ProjectList from './_components/ProjectList'
import { FadeIn, DecodeText } from '@/components/animations'
import { NavBar } from '@/components/ui'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Parallélisation des requêtes indépendantes
  const [t, tProjects, projects] = await Promise.all([
    getTranslations('nav'),
    getTranslations('projects'),
    getProjects()
  ])

  const yearRange = projects.length > 0 
    ? `${projects[projects.length - 1]?.year}–${projects[0]?.year}` 
    : '2023–2024'

  return (
    <main className="relative min-h-screen">
        <NavBar 
          links={[
            { href: '/about', label: t('about'), position: 'right' },
          ]} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <header className="mb-12 sm:mb-20">
            <FadeIn>
              <DecodeText
                text={tProjects('title')}
                as="h1"
                className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-primary uppercase tracking-tight"
                duration={0.4}
                delay={0.1}
              />
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="font-mono text-sm text-muted mt-4 max-w-md">
                {tProjects('selectedWorks', { range: yearRange })}
              </p>
            </FadeIn>
          </header>

          <FadeIn delay={0.2}>
            <ProjectList projects={projects} locale={locale} />
          </FadeIn>
        </div>
    </main>
  )
}
