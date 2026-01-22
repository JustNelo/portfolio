import { FadeIn, DecodeText } from '@/components/animations'
import type { Profile } from '@/lib/validations/about'

interface AboutHeaderProps {
  profile: Profile | null
  locale: string
}

export default function AboutHeader({ profile, locale }: AboutHeaderProps) {
  if (!profile) {
    return null
  }

  // Use English translations if locale is 'en' and translations exist
  const bio = locale === 'en' && profile.bioEn?.length ? profile.bioEn : profile.bio
  const ctaText = locale === 'en' && profile.ctaTextEn ? profile.ctaTextEn : profile.ctaText

  return (
    <div>
      <div>
        <FadeIn delay={0.2}>
          <div className="space-y-0 mb-8 sm:mb-12">
            <DecodeText
              text={profile.firstName}
              as="h3"
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight leading-[0.85] text-primary italic"
              duration={0.7}
              delay={0.2}
            />
            <DecodeText
              text={profile.lastName}
              as="h3"
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight leading-[0.85] pl-2 sm:pl-4 md:pl-16 lg:pl-24 xl:pl-38 mt-2 sm:mt-4 text-primary"
              duration={0.7}
              delay={0.2}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
        <div className="space-y-3 sm:space-y-4 text-secondary text-sm sm:text-base leading-relaxed pl-0 sm:pl-4 md:pl-16 lg:pl-24 xl:pl-38 [&>p:last-of-type]:mb-0 max-w-2xl">
          {bio.map((paragraph, index) => (
            <DecodeText key={index} text={paragraph} as="p" duration={0.7} delay={0.2} />
          ))}

          <a 
            href={profile.ctaHref}
            className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-accent text-accent-foreground font-medium text-sm sm:text-base uppercase tracking-wider hover:opacity-80 transition-all w-fit mt-6 sm:mt-8"
          >
            <DecodeText text={ctaText} duration={0.7} delay={0.2} />
          </a>
        </div>
        </FadeIn>
      </div>
    </div>
  )
}
