'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/about'
import type { Profile } from '@/lib/validations/about'

interface ProfileFormProps {
  profile: Profile | null
}

type Lang = 'fr' | 'en'

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeLang, setActiveLang] = useState<Lang>('fr')
  const [bioLines, setBioLines] = useState<string[]>(profile?.bio || [''])
  const [bioLinesEn, setBioLinesEn] = useState<string[]>(profile?.bioEn?.length ? profile.bioEn : [''])
  const [bioMuted, setBioMuted] = useState(profile?.bioMuted || '')
  const [bioMutedEn, setBioMutedEn] = useState(profile?.bioMutedEn || '')
  const [ctaText, setCtaText] = useState(profile?.ctaText || '')
  const [ctaTextEn, setCtaTextEn] = useState(profile?.ctaTextEn || '')

  const handleAddBioLine = (lang: Lang) => {
    if (lang === 'fr') {
      setBioLines([...bioLines, ''])
    } else {
      setBioLinesEn([...bioLinesEn, ''])
    }
  }

  const handleRemoveBioLine = (index: number, lang: Lang) => {
    if (lang === 'fr') {
      if (bioLines.length > 1) {
        setBioLines(bioLines.filter((_, i) => i !== index))
      }
    } else {
      if (bioLinesEn.length > 1) {
        setBioLinesEn(bioLinesEn.filter((_, i) => i !== index))
      }
    }
  }

  const handleBioChange = (index: number, value: string, lang: Lang) => {
    if (lang === 'fr') {
      const newBioLines = [...bioLines]
      newBioLines[index] = value
      setBioLines(newBioLines)
    } else {
      const newBioLines = [...bioLinesEn]
      newBioLines[index] = value
      setBioLinesEn(newBioLines)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('bio', JSON.stringify(bioLines.filter((line) => line.trim() !== '')))
    formData.set('bio_en', JSON.stringify(bioLinesEn.filter((line) => line.trim() !== '')))
    formData.set('bio_muted', bioMuted)
    formData.set('bio_muted_en', bioMutedEn)
    formData.set('cta_text', ctaText)
    formData.set('cta_text_en', ctaTextEn)

    const result = await updateProfile(formData)
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    setIsLoading(false)
  }

  const currentBioLines = activeLang === 'fr' ? bioLines : bioLinesEn

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name fields - not translatable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Prénom
          </label>
          <input
            type="text"
            name="first_name"
            defaultValue={profile?.firstName || ''}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            placeholder="John"
            required
          />
        </div>
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Nom
          </label>
          <input
            type="text"
            name="last_name"
            defaultValue={profile?.lastName || ''}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            placeholder="Doe"
            required
          />
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveLang('fr')}
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
          onClick={() => setActiveLang('en')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-t-lg transition-all ${
            activeLang === 'en'
              ? 'bg-primary/20 text-primary border-b-2 border-primary'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      {/* Bio - translatable */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
            Bio (paragraphes) {activeLang === 'en' && '- EN'}
          </label>
          <button
            type="button"
            onClick={() => handleAddBioLine(activeLang)}
            className="font-mono text-[10px] text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {currentBioLines.map((line, index) => (
            <div key={`${activeLang}-${index}`} className="flex gap-2">
              <textarea
                value={line}
                onChange={(e) => handleBioChange(index, e.target.value, activeLang)}
                rows={2}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                placeholder={activeLang === 'fr' ? `Paragraphe ${index + 1}...` : `Paragraph ${index + 1}...`}
              />
              {currentBioLines.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBioLine(index, activeLang)}
                  className="px-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bio Muted - translatable */}
      <div>
        <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
          Note secondaire {activeLang === 'en' && '- EN'} (optionnel)
        </label>
        {activeLang === 'fr' ? (
          <textarea
            value={bioMuted}
            onChange={(e) => setBioMuted(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
            placeholder="Texte secondaire affiché en gris..."
          />
        ) : (
          <textarea
            value={bioMutedEn}
            onChange={(e) => setBioMutedEn(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
            placeholder="Secondary text displayed in gray..."
          />
        )}
      </div>

      {/* CTA - translatable text, shared link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Texte du CTA {activeLang === 'en' && '- EN'}
          </label>
          {activeLang === 'fr' ? (
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              placeholder="Me contacter"
            />
          ) : (
            <input
              type="text"
              value={ctaTextEn}
              onChange={(e) => setCtaTextEn(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              placeholder="Contact me"
            />
          )}
        </div>
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Lien du CTA
          </label>
          <input
            type="text"
            name="cta_href"
            defaultValue={profile?.ctaHref || ''}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            placeholder="mailto:contact@example.com"
          />
        </div>
      </div>

      
      {message && (
        <div
          className={`p-3 rounded-lg font-mono text-xs ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-5 py-3.5 bg-primary/90 backdrop-blur-sm text-background font-mono text-xs uppercase tracking-widest hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Enregistrement...' : 'Enregistrer le profil'}
      </button>
    </form>
  )
}
