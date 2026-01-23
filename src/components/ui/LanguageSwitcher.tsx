'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/lib/i18n/navigation'
import { locales, type Locale } from '@/lib/i18n/config'
import { useSceneStore } from '@/stores/useSceneStore'

const localeLabels: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
}

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const triggerLoader = useSceneStore((state) => state.triggerLoader)

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return
    triggerLoader()
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest">
      {locales.map((loc, index) => (
        <span key={loc} className="flex items-center">
          {index > 0 && <span className="text-white/30 mx-1">/</span>}
          <button
            onClick={() => handleChange(loc)}
            className={`
              transition-colors hover:cursor-pointer
              ${locale === loc 
                ? 'text-primary' 
                : 'text-white/40 hover:text-white/70'
              }
            `}
            aria-label={`Switch to ${localeLabels[loc]}`}
          >
            {localeLabels[loc]}
          </button>
        </span>
      ))}
    </div>
  )
}
