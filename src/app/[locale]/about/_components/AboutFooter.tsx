import type { Social } from '@/lib/validations/about'

interface AboutFooterProps {
  socials: Social[]
}

export default function AboutFooter({ socials }: AboutFooterProps) {
  return (
    <div className="flex flex-col gap-2">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.href}
          className="w-fit text-m text-muted hover:text-primary transition-colors uppercase tracking-wider"
        >
          {social.name}
        </a>
      ))}
    </div>
  )
}
