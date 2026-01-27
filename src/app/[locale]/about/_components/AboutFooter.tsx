import { getTranslations } from 'next-intl/server'
import type { Social } from '@/lib/validations/about'

interface AboutFooterProps {
  socials: Social[]
}

export default async function AboutFooter({ socials }: AboutFooterProps) {
  const t = await getTranslations('a11y')
  
  return (
    <div className="flex flex-col gap-2">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-m text-muted hover:text-primary transition-colors uppercase tracking-wider"
          aria-label={t('externalLink', { name: social.name })}
        >
          {social.name}
        </a>
      ))}
    </div>
  )
}
