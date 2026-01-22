'use client'

import type { Experience, Education } from '@/lib/validations/about'

const inputClasses = 
  'bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all'

interface TimelineFormProps {
  type: 'experience' | 'education'
  item?: Experience | Education
  isLoading: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export default function TimelineForm({ type, item, isLoading, onSubmit, onCancel }: TimelineFormProps) {
  const isExperience = type === 'experience'
  const experience = item as Experience | undefined
  const education = item as Education | undefined

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-3 ${item ? '' : 'bg-primary/5 border border-primary/20 rounded-lg p-4'}`}
    >
      <input type="hidden" name="type" value={type} />
      
      {isExperience ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="title"
              defaultValue={experience?.title || ''}
              className={inputClasses}
              placeholder="Titre du poste (FR)"
              required
            />
            <input
              type="text"
              name="company"
              defaultValue={experience?.company || ''}
              className={inputClasses}
              placeholder="Entreprise"
              required
            />
          </div>
          <input
            type="text"
            name="title_en"
            defaultValue={experience?.titleEn || ''}
            className={`w-full ${inputClasses}`}
            placeholder="Job title (EN)"
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="degree"
              defaultValue={education?.degree || ''}
              className={inputClasses}
              placeholder="Diplôme (FR)"
              required
            />
            <input
              type="text"
              name="school"
              defaultValue={education?.school || ''}
              className={inputClasses}
              placeholder="Établissement"
              required
            />
          </div>
          <input
            type="text"
            name="degree_en"
            defaultValue={education?.degreeEn || ''}
            className={`w-full ${inputClasses}`}
            placeholder="Degree (EN)"
          />
        </>
      )}

      <input
        type="text"
        name="period"
        defaultValue={item?.period || ''}
        className={`w-full ${inputClasses}`}
        placeholder={isExperience ? 'Ex: 2022 - Present' : 'Ex: 2018 - 2022'}
        required
      />
      <textarea
        name="description"
        defaultValue={item?.description || ''}
        rows={2}
        className={`w-full ${inputClasses} resize-none`}
        placeholder="Description (FR)..."
      />
      <textarea
        name="description_en"
        defaultValue={item?.descriptionEn || ''}
        rows={2}
        className={`w-full ${inputClasses} resize-none`}
        placeholder="Description (EN)..."
      />
      
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary/80 text-background font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : item ? 'Sauver' : 'Ajouter'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-white/10 font-mono text-[10px] text-white/60 uppercase tracking-widest rounded-lg hover:border-white/30 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
