import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjectBySlug, getProjects } from '@/lib/actions/project'
import { notFound } from 'next/navigation'
import { FadeIn } from '@/components/animations'
import { NavBar } from '@/components/ui'
import { 
  ProjectHeader, 
  ProjectMetadata, 
  MediaGallery,
  ProjectFooter
} from '@/components/projects'

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }

  const title = locale === 'en' && project.title_en ? project.title_en : project.title;
  const description = locale === 'en' && project.description_en ? project.description_en : project.description;
  const firstImage = project.project_medias?.find(m => m.type === 'image')?.url;

  return {
    title,
    description,
    alternates: {
      canonical: './',
      languages: {
        'fr': `/fr/projects/${slug}`,
        'en': `/en/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      images: firstImage ? [{ url: firstImage }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
    const [t, tDetail, tA11y, project, allProjects] = await Promise.all([
    getTranslations('nav'),
    getTranslations('projectDetail'),
    getTranslations('a11y'),
    getProjectBySlug(slug),
    getProjects()
  ])

  if (!project) {
    notFound()
  }

  const medias = project.project_medias || []

  const currentIndex = allProjects.findIndex(p => p.slug === slug)
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1
    ? allProjects[currentIndex + 1]
    : allProjects[0] 
  return (
    <main className="relative min-h-screen">
        <NavBar 
          links={[
            { href: '/projects', label: t('backToIndex'), position: 'right' },
          ]} 
        />

        <div className="flex flex-col lg:flex-row min-h-screen">
                    <aside className="lg:fixed lg:top-0 lg:left-0 lg:w-[40%] xl:w-[35%] lg:h-screen p-6 sm:p-8 lg:p-10 xl:p-14 flex flex-col">
                        <div className="pt-12 lg:pt-0">
              <ProjectHeader 
                title={locale === 'en' && project.title_en ? project.title_en : project.title} 
              />

              <FadeIn delay={0.15}>
                <p className="font-mono text-xs sm:text-sm text-secondary leading-relaxed mt-6 lg:mt-10 max-w-lg">
                  {locale === 'en' && project.description_en ? project.description_en : project.description}
                </p>
              </FadeIn>
            </div>

                        <div className="mt-auto">
              <ProjectMetadata
                agency={project.agency}
                client={project.client}
                responsibilities={locale === 'en' && project.responsibilities_en?.length ? project.responsibilities_en : project.responsibilities}
                development={locale === 'en' && project.development_en ? project.development_en : project.development}
              />
            </div>
          </aside>

                    <div className="lg:ml-[35%] lg:mr-[15%] flex-1 px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 lg:pt-56">
            <MediaGallery 
              medias={medias} 
              projectTitle={project.title} 
              videoAriaLabel={tA11y('projectVideo', { title: project.title })}
            />
            
            <ProjectFooter 
              nextProjectSlug={nextProject?.slug}
              nextProjectTitle={locale === 'en' && nextProject?.title_en ? nextProject.title_en : nextProject?.title}
              translations={{
                likeWhatYouSee: tDetail('likeWhatYouSee'),
                letsTalk: tDetail('letsTalk'),
                wantToSeeMore: tDetail('wantToSeeMore'),
                nextProject: tDetail('nextProject'),
              }}
            />
          </div>
        </div>
    </main>
  )
}
