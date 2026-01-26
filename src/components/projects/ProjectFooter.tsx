import { Link } from '@/lib/i18n/navigation'
import { FadeIn, DecodeText } from '@/components/animations'

interface ProjectFooterProps {
  nextProjectSlug?: string | null
  nextProjectTitle?: string | null
  translations: {
    likeWhatYouSee: string
    letsTalk: string
    wantToSeeMore: string
    nextProject: string
  }
}

export default function ProjectFooter({ 
  nextProjectSlug,
  translations 
}: ProjectFooterProps) {
  return (
    <footer className="mt-32 lg:mt-58 pb-6 lg:pb-8">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-end justify-between">
        {/* Let's Talk CTA */}
        <FadeIn>
          <Link 
            href="/about" 
            className="group block"
          >
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-3 w-34">
              {translations.likeWhatYouSee}
            </p>
            <DecodeText
              text={translations.letsTalk}
              as="h2"
              className="font-heading text-4xl sm:text-6xl lg:text-5xl xl:text-6xl text-primary uppercase tracking-tight leading-[0.9] group-hover:opacity-70 transition-opacity"
              duration={0.3}
              ignoreLoader
            />
          </Link>
        </FadeIn>

        {/* Next Project CTA */}
        {nextProjectSlug && (
          <FadeIn delay={0.1}>
            <Link 
              href={`/projects/${nextProjectSlug}`}
              className="group block text-right lg:text-left"
            >
              <p className="font-mono text-xs text-muted uppercase tracking-widest mb-3 w-34">
                {translations.wantToSeeMore}
              </p>
              <DecodeText
                text={translations.nextProject}
                as="h2"
                className="font-heading text-4xl sm:text-6xl lg:text-5xl xl:text-6xl text-primary uppercase tracking-tight leading-[0.9] group-hover:opacity-70 transition-opacity"
                duration={0.3}
                ignoreLoader
              />
            </Link>
          </FadeIn>
        )}
      </div>
    </footer>
  )
}
