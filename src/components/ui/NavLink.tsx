import { Link } from '@/lib/i18n/navigation'
import { FadeIn } from '@/components/animations'
import LanguageSwitcher from './LanguageSwitcher'

export interface NavLinkProps {
  href: string
  label: string
  /** Position: 'left' or 'right' */
  position?: 'left' | 'right'
  /** Delay for FadeIn animation */
  delay?: number
}

/**
 * Reusable navigation link component
 * Fixed position in top corners with backdrop blur
 * Uses prefetch for instant navigation
 */
export default function NavLink({ 
  href, 
  label, 
  delay = 0 
}: NavLinkProps) {
  return (
    <FadeIn delay={delay}>
      <Link 
        href={href}
        prefetch={true}
        className="inline-flex items-center gap-2 font-mono text-[11px] text-primary hover:text-muted transition-colors uppercase tracking-widest border border-primary/30 px-4 py-2.5 bg-background/80 backdrop-blur-md"
      >
        <span>{label}</span>
      </Link>
    </FadeIn>
  )
}

export interface NavBarProps {
  links: NavLinkProps[]
}

/**
 * Navigation bar with multiple links
 * Fixed at top of screen
 */
export function NavBar({ links }: NavBarProps) {
  return (
    <nav className="fixed top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 z-50 flex justify-between items-center pointer-events-none">
      <div className="flex gap-3 items-center pointer-events-auto">
        {links.filter(l => l.position === 'left').map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>
      <div className="flex gap-3 items-center pointer-events-auto">
        <FadeIn delay={0.1}>
          <div className="border border-primary/30 px-4 py-2.5 bg-background/80 backdrop-blur-md">
            <LanguageSwitcher />
          </div>
        </FadeIn>
        {links.filter(l => l.position !== 'left').map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>
    </nav>
  )
}
