import { socials } from '@/data/about'

export default function AboutFooter() {
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
