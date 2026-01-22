'use client'

type Lang = 'fr' | 'en'

interface LanguageTabsProps {
  activeLang: Lang
  onLangChange: (lang: Lang) => void
}

export default function LanguageTabs({ activeLang, onLangChange }: LanguageTabsProps) {
  return (
    <div className="flex gap-2 border-b border-white/10 pb-2" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeLang === 'fr'}
        onClick={() => onLangChange('fr')}
        className={`px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-t-lg transition-all ${
          activeLang === 'fr'
            ? 'bg-primary/20 text-primary border-b-2 border-primary'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        🇫🇷 Français
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeLang === 'en'}
        onClick={() => onLangChange('en')}
        className={`px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-t-lg transition-all ${
          activeLang === 'en'
            ? 'bg-primary/20 text-primary border-b-2 border-primary'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        🇬🇧 English
      </button>
    </div>
  )
}
