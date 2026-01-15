import { personalInfo } from '@/data/about'

export default function AboutHeader() {
  return (
    <div>
      <div>
        {/* Name */}
        <div className="space-y-0 mb-12">
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[0.85] text-primary italic">
            {personalInfo.firstName}
          </h1>
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[0.85] pl-4 md:pl-38 mt-4 text-primary">
            {personalInfo.lastName}
          </h1>
        </div>

        {/* Bio */}
        <div className="space-y-4 text-secondary text-m leading-relaxed pl-38 [&>p:last-of-type]:mb-0 max-w-2xl">
          {personalInfo.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p className="text-muted">{personalInfo.bioMuted}</p>

          <a 
            href={personalInfo.ctaHref}
            className="inline-flex items-center px-5 py-2.5 bg-accent text-accent-foreground font-medium text-m uppercase tracking-wider hover:opacity-80 transition-all w-fit mt-8"
          >
            {personalInfo.ctaText}
          </a>
        </div>
      </div>
    </div>
  )
}
