import { getTranslations } from 'next-intl/server'
import { FadeIn, DecodeText } from '@/components/animations'
import type { Skill, Experience, Education, TimelineItem } from '@/lib/validations/about'

interface AboutContentProps {
  skills: Skill[]
  experiences: TimelineItem[]
  education: TimelineItem[]
  locale: string
}

type TimelineType = 'EXP' | 'EDU'

interface TimelineEntryProps {
  item: TimelineItem
  index: number
  type: TimelineType
  locale: string
}

const OFFSET_PATTERNS = [
  '', 
  '2xl:ml-16', 
  '2xl:ml-8', 
  '2xl:ml-24', 
  '2xl:ml-4', 
  '2xl:ml-20'
]
const STAGGER_DELAY = 0.12

function calculateYears(period: string): number {
  const parts = period.split(' - ')
  const start = parseInt(parts[0])
  const end = parts[1]?.toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(parts[1])
  return isNaN(end - start) ? 0 : end - start
}

function isExperience(item: TimelineItem): item is Experience {
  return item.type === 'experience'
}

function isEducation(item: TimelineItem): item is Education {
  return item.type === 'education'
}

function TimelineEntry({ item, index, type, locale }: TimelineEntryProps) {
  const periodParts = item.period.split(' - ')
  const displayYear = periodParts[1] ?? periodParts[0]
  const yearsCount = calculateYears(item.period)
  const offset = OFFSET_PATTERNS[index % OFFSET_PATTERNS.length]
  
  // Use English translations if locale is 'en' and translations exist
  const title = isExperience(item) 
    ? (locale === 'en' && item.titleEn ? item.titleEn : item.title)
    : (locale === 'en' && item.degreeEn ? item.degreeEn : item.degree)
  const subtitle = isExperience(item) ? item.company : item.school
  const description = locale === 'en' && item.descriptionEn ? item.descriptionEn : item.description
  const itemDelay = STAGGER_DELAY + (index * 0.08)

  return (
    <FadeIn delay={itemDelay} className={`relative py-4 sm:py-8 px-4 sm:px-0 ${offset}`}>
      <ConnectorLine index={index} />
      
      <div className="relative">
        <OutlinedYear year={displayYear} />
        <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 left-0 sm:left-1 md:left-2">
          <DecodeText
            text={title}
            as="h3"
            className="leading-none text-lg sm:text-xl md:text-2xl font-bold text-white"
            duration={0.7}
            delay={itemDelay}
          />
        </div>
      </div>
      
      <div className="mt-3 sm:mt-4 md:mt-6 max-w-xl">
        <p className="font-mono text-[10px] sm:text-xs text-white/50 mb-2 sm:mb-3 tracking-wide">
          {subtitle} — {item.period}
        </p>
        <p className="font-mono text-[10px] sm:text-xs text-white/60 leading-relaxed sm:leading-loose">
          {description}
        </p>
      </div>
      
      <div 
        className="absolute right-2 sm:-right-4 md:-right-6 top-6 sm:top-8 font-mono text-[8px] sm:text-[9px] text-white/20 tracking-widest"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        {yearsCount}Y_{type}
      </div>
      
      <div className={`absolute bottom-0 h-px bg-white/10 ${index % 2 === 0 ? 'left-4 sm:left-0 w-1/2 sm:w-2/3' : 'right-4 sm:right-0 w-1/3 sm:w-1/2'}`} />
    </FadeIn>
  )
}

function OutlinedYear({ year }: { year: string }) {
  return (
    <span 
      className="font-heading text-6xl sm:text-[80px] md:text-[100px] lg:text-[140px] leading-none select-none block"
      style={{
        WebkitTextStroke: '1px var(--color-stroke)',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {year}
    </span>
  )
}

function ConnectorLine({ index }: { index: number }) {
  const position = index % 2 === 0 ? 'left-4 sm:left-0' : 'right-4 sm:right-0'
  const width = index % 3 === 0 ? 'w-16 sm:w-24' : 'w-12 sm:w-16'
  return <div className={`absolute top-0 h-px bg-white/40 ${width} ${position}`} />
}

export default async function AboutContent({ skills, experiences, education, locale }: AboutContentProps) {
  const t = await getTranslations('about')

  return (
    <div className="flex flex-col pt-4 sm:pt-8 md:pt-12 pb-8 sm:pb-12 md:pb-16">
      
      <section className="relative py-4 sm:py-8 md:py-12 mb-4 sm:mb-6 md:mb-8 px-4 sm:px-0">
        <FadeIn className="relative">
          <DecodeText
            text={t('skillsManifest')}
            as="div"
            className="hidden 2xl:block absolute -left-2 2xl:-left-6 top-0 text-[9px] text-white/30 tracking-[0.4em] uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            duration={0.6}
          />
          <DecodeText
            text={t('skills')}
            as="div"
            className="2xl:hidden text-[10px] text-white/30 tracking-[0.3em] uppercase mb-4"
            duration={0.6}
          />

          <div className="2xl:ml-10 flex flex-wrap gap-2 sm:gap-3">
            {skills.map((skill: Skill, index: number) => {
              const category = locale === 'en' && skill.categoryEn ? skill.categoryEn : skill.category
              return (
              <FadeIn 
                key={skill.category} 
                className="border border-white/20 p-2 sm:p-3 flex-1 min-w-35 sm:min-w-0 sm:flex-none"
                delay={0.1 + index * 0.08}
              >
                <DecodeText
                  text={category}
                  as="span"
                  className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-[0.2em] block mb-1.5 sm:mb-2"
                  duration={0.5}
                  delay={0.15 + index * 0.08}
                />
                <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1">
                  {skill.items.map((item: string) => (
                    <span key={item} className="font-mono text-[10px] sm:text-xs text-white hover:text-white/60 transition-opacity">
                      {item}
                    </span>
                  ))}
                </div>
              </FadeIn>
              )
            })}
          </div>
        </FadeIn>
      </section>

      <section className="relative py-4 sm:py-8">
        <FadeIn className="relative mb-4 sm:mb-12 pl-4">
          <div className="absolute left-0 top-1/2 w-px h-6 sm:h-8 -translate-y-1/2 bg-white/40" />
          <DecodeText
            text={t('experience')}
            as="h2"
            className="font-heading text-2xl sm:text-3xl md:text-4xl text-white tracking-wide"
            duration={0.6}
          />
        </FadeIn>
        <div>
          {experiences.filter(isExperience).map((exp, i) => (
            <TimelineEntry key={exp.id} item={exp} index={i} type="EXP" locale={locale} />
          ))}
        </div>
      </section>

      <section className="relative py-4 sm:py-8 mt-4 sm:mt-8">
        <FadeIn className="relative mb-4 sm:mb-12 pl-4">
          <div className="absolute left-0 top-0 w-px h-full bg-white/40" />
          <DecodeText
            text={t('education')}
            as="h2"
            className="font-heading text-2xl sm:text-3xl md:text-4xl text-white tracking-wide"
            duration={0.6}
          />
        </FadeIn>
        <div>
          {education.filter(isEducation).map((edu, i) => (
            <TimelineEntry key={edu.id} item={edu} index={i} type="EDU" locale={locale} />
          ))}
        </div>
      </section>
    </div>
  )
}
