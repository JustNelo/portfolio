'use client'

const socials = [
  { name: 'Email', href: 'mailto:contact@example.com' },
  { name: 'LinkedIn', href: '#' },
  { name: 'GitHub', href: '#' },
]

export default function AboutSection(): React.JSX.Element {
  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-12 flex flex-col backdrop-blur-sm">
      {/* Main content grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column - Name, Photo, Bio */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Name */}
          <div className="space-y-0 mb-8">
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[0.85] text-primary italic">
              LÉON
            </h1>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[0.85] pl-4 md:pl-6 text-primary">
              GALLET
            </h1>
          </div>

          {/* Bio */}
          <div className="space-y-4 text-secondary text-m leading-relaxed max-w-sm">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p className="text-muted">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* CTA */}
          <a 
            href="mailto:contact@example.com"
            className="inline-flex items-center px-5 py-2.5 bg-accent text-accent-foreground font-medium text-m uppercase tracking-wider hover:opacity-80 transition-all w-fit mt-6"
          >
            Lorem Ipsum
          </a>
        </div>
      </div>

      {/* Footer - Socials */}
      <div className="flex flex-col gap-2 pt-8 mt-auto">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            className="text-m text-muted hover:text-primary transition-colors uppercase tracking-wider"
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  )
}
