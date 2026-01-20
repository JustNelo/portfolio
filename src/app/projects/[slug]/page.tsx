import { supabase } from '@/lib/supabase'
import type { Project, ProjectMedia } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FadeIn, DecodeText } from '@/components/animations'
import Scene from '@/components/Scene'

interface ProjectWithMedias extends Project {
  medias: ProjectMedia[]
}

async function getProject(slug: string): Promise<ProjectWithMedias | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      medias:project_medias(*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as ProjectWithMedias
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  const sortedMedias = project.medias?.sort((a, b) => a.order - b.order) || []

  return (
    <>
      <Scene />
      <main className="relative min-h-screen">
        {/* Return button - fixed top right */}
        <nav className="fixed top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-50">
          <FadeIn>
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 font-mono text-[11px] text-primary hover:text-muted transition-colors uppercase tracking-widest border border-primary/30 px-4 py-2.5 bg-background/80 backdrop-blur-md"
            >
              <span>Return to index</span>
            </Link>
          </FadeIn>
        </nav>

        {/* Main layout: fixed left sidebar + scrollable right content */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left column - fixed on desktop */}
          <aside className="lg:fixed lg:top-0 lg:left-0 lg:w-[40%] xl:w-[35%] lg:h-screen lg:overflow-y-auto p-6 sm:p-8 lg:p-10 xl:p-14">
            <div className="pt-8 lg:pt-0">
              {/* Title */}
              <FadeIn>
                <DecodeText
                  text={project.title}
                  as="h1"
                  className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-primary uppercase tracking-tight leading-[0.9]"
                  duration={0.5}
                  delay={0.1}
                />
              </FadeIn>

              {/* Description */}
              <FadeIn delay={0.15}>
                <p className="font-mono text-xs sm:text-sm text-secondary leading-relaxed mt-6 lg:mt-10 max-w-lg">
                  {project.description}
                </p>
              </FadeIn>

              {/* Metadata */}
              <FadeIn delay={0.2}>
                <div className="mt-8 lg:mt-12 space-y-4">
                  {project.agency && (
                    <div>
                      <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1">
                        Agency
                      </span>
                      <span className="font-mono text-sm text-primary uppercase tracking-wide">
                        {project.agency}
                      </span>
                    </div>
                  )}

                  {project.client && (
                    <div>
                      <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1">
                        Client
                      </span>
                      <span className="font-mono text-sm text-primary uppercase tracking-wide">
                        {project.client}
                      </span>
                    </div>
                  )}

                  {project.responsibilities && project.responsibilities.length > 0 && (
                    <div>
                      <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1">
                        Responsibilities
                      </span>
                      <ul className="space-y-0.5">
                        {project.responsibilities.map((resp) => (
                          <li key={resp} className="font-mono text-sm text-primary uppercase tracking-wide">
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.development && (
                    <div>
                      <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1">
                        Development
                      </span>
                      <span className="font-mono text-sm text-primary uppercase tracking-wide">
                        {project.development}
                      </span>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          </aside>

          {/* Right column - scrollable medias */}
          <div className="lg:ml-[40%] xl:ml-[35%] flex-1 p-4 sm:p-6 lg:p-6 xl:p-8">
            {sortedMedias.length > 0 && (
              <div className="space-y-4 lg:space-y-6">
                {sortedMedias.map((media, index) => (
                  <FadeIn key={media.id} delay={0.25 + index * 0.05}>
                    <div className="relative aspect-16/10 bg-card overflow-hidden">
                      {media.type === 'image' ? (
                        <Image
                          src={media.url}
                          alt={media.alt || project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 65vw"
                        />
                      ) : (
                        <video
                          src={media.url}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      )}
                      {media.duration && (
                        <div className="absolute top-4 left-4 font-mono text-sm text-primary">
                          {String(Math.floor(media.duration / 60)).padStart(2, '0')}:{String(media.duration % 60).padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
