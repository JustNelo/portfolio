import { getTranslations, getLocale } from 'next-intl/server';
import { AboutHeader, AboutFooter, AboutContent, InfiniteScroll } from '@/app/[locale]/about/_components'
import { NavBar } from '@/components/ui'
import { getProfile, getSocials, getSkills, getExperiences, getEducation } from '@/lib/actions/about'

export default async function AboutSection(): Promise<React.JSX.Element> {
  const t = await getTranslations('nav');
  const locale = await getLocale();
  
  const [profile, socials, skills, experiences, education] = await Promise.all([
    getProfile(),
    getSocials(),
    getSkills(),
    getExperiences(),
    getEducation(),
  ])

  return (
    <section className="relative h-screen overflow-hidden">
      <NavBar 
        links={[
          { href: '/projects', label: t('projects'), position: 'right' },
        ]} 
      />

      <div className="hidden 2xl:block fixed top-0 left-0 right-0 z-10 p-6 2xl:p-12 pointer-events-none">
        <div className="grid grid-cols-24 gap-8 2xl:gap-16">
          <div className="col-span-10 pointer-events-auto">
            <AboutHeader profile={profile} locale={locale} />
          </div>
        </div>
      </div>

      <InfiniteScroll>
        <div className="relative 2xl:pt-20 pb-0 2xl:pb-20">
          <div className="2xl:hidden p-4 sm:p-0">
            <AboutHeader profile={profile} locale={locale} />
          </div>
          <AboutContent 
            skills={skills} 
            experiences={experiences} 
            education={education}
            locale={locale}
          />
          <div className="2xl:hidden p-4 sm:p-0 mb-8">
            <AboutFooter socials={socials} />
          </div>
        </div>
      </InfiniteScroll>

      <div className="hidden 2xl:block fixed bottom-0 left-0 right-0 z-10 p-6 2xl:p-12 pointer-events-none">
        <div className="grid grid-cols-24 gap-8 2xl:gap-16">
          <div className="col-span-7 pointer-events-auto">
            <AboutFooter socials={socials} />
          </div>
        </div>
      </div>
    </section>
  )
}
