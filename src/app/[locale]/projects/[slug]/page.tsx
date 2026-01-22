import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjectBySlug } from '@/services/project.service'
import { notFound } from 'next/navigation'
import { FadeIn } from '@/components/animations'
import { NavBar } from '@/components/ui'
import { 
  ProjectHeader, 
  ProjectMetadata, 
  MediaGallery
} from '@/components/projects'

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('nav');
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const sortedMedias = project.medias?.sort((a, b) => a.order - b.order) || []

  return (
    <main className="relative min-h-screen">
        <NavBar 
          links={[
            { href: '/projects', label: t('backToIndex'), position: 'right' },
          ]} 
        />

        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left column - fixed on desktop */}
          <aside className="lg:fixed lg:top-0 lg:left-0 lg:w-[40%] xl:w-[35%] lg:h-screen lg:overflow-y-auto p-6 sm:p-8 lg:p-10 xl:p-14">
            <div className="pt-8 lg:pt-0">
              <ProjectHeader 
                title={locale === 'en' && project.title_en ? project.title_en : project.title} 
              />

              <FadeIn delay={0.15}>
                <p className="font-mono text-xs sm:text-sm text-secondary leading-relaxed mt-6 lg:mt-10 max-w-lg">
                  {locale === 'en' && project.description_en ? project.description_en : project.description}
                </p>
              </FadeIn>

              <ProjectMetadata
                agency={project.agency}
                client={project.client}
                responsibilities={locale === 'en' && project.responsibilities_en?.length ? project.responsibilities_en : project.responsibilities}
                development={locale === 'en' && project.development_en ? project.development_en : project.development}
              />
            </div>
          </aside>

          {/* Right column - scrollable medias */}
          <div className="lg:ml-[40%] xl:ml-[35%] flex-1 p-4 sm:p-6 lg:p-6 xl:p-8">
            <MediaGallery medias={sortedMedias} projectTitle={project.title} />
          </div>
        </div>
    </main>
  )
}
