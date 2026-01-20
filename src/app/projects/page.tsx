import { getProjects } from '@/services/project.service'
import ProjectList from './_components/ProjectList'
import { FadeIn, DecodeText } from '@/components/animations'
import { NavBar } from '@/components/ui'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="relative min-h-screen">
        <NavBar 
          links={[
            { href: '/about', label: 'À propos', position: 'right' },
          ]} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <header className="mb-12 sm:mb-20">
            <FadeIn>
              <DecodeText
                text="PROJECTS"
                as="h1"
                className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-primary uppercase tracking-tight"
                duration={0.4}
                delay={0.1}
              />
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="font-mono text-sm text-muted mt-4 max-w-md">
                Selected works from {projects.length > 0 ? `${projects[projects.length - 1]?.year}–${projects[0]?.year}` : '2023–2024'}
              </p>
            </FadeIn>
          </header>

          <FadeIn delay={0.2}>
            <ProjectList projects={projects} />
          </FadeIn>
        </div>
    </main>
  )
}
