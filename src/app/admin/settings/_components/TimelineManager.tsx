'use client'

import { useState } from 'react'
import { addTimelineItem, updateTimelineItem, deleteTimelineItem } from '@/lib/actions/about'
import type { TimelineItem, Experience, Education } from '@/lib/validations/about'

interface TimelineManagerProps {
  initialTimeline: TimelineItem[]
}

export default function TimelineManager({ initialTimeline }: TimelineManagerProps) {
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline)
  const [addingType, setAddingType] = useState<'experience' | 'education' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const experiences = timeline.filter((item): item is Experience => item.type === 'experience')
  const education = timeline.filter((item): item is Education => item.type === 'education')

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('order', String(timeline.length))

    const result = await addTimelineItem(formData)
    if (result.success && result.data) {
      setTimeline([...timeline, result.data])
      setAddingType(null)
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, item: TimelineItem) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('id', item.id)
    formData.set('order', String(item.order))

    const result = await updateTimelineItem(formData)
    if (result.success) {
      const type = formData.get('type') as 'experience' | 'education'
      setTimeline(timeline.map(t => t.id === item.id ? {
        ...t,
        period: formData.get('period') as string,
        description: (formData.get('description') as string) || '',
        descriptionEn: (formData.get('description_en') as string) || '',
        ...(type === 'experience' ? {
          title: formData.get('title') as string,
          company: formData.get('company') as string,
          titleEn: (formData.get('title_en') as string) || '',
        } : {
          degree: formData.get('degree') as string,
          school: formData.get('school') as string,
          degreeEn: (formData.get('degree_en') as string) || '',
        }),
      } : t))
      setEditingId(null)
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément du parcours ?')) return
    setIsLoading(true)

    const result = await deleteTimelineItem(id)
    if (result.success) {
      setTimeline(timeline.filter((item) => item.id !== id))
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const renderExperienceForm = (experience?: Experience) => (
    <form
      onSubmit={experience ? (e) => handleUpdate(e, experience) : handleAdd}
      className={`space-y-3 ${experience ? '' : 'bg-primary/5 border border-primary/20 rounded-lg p-4'}`}
    >
      <input type="hidden" name="type" value="experience" />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="title"
          defaultValue={experience?.title || ''}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
          placeholder="Titre du poste (FR)"
          required
        />
        <input
          type="text"
          name="company"
          defaultValue={experience?.company || ''}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
          placeholder="Entreprise"
          required
        />
      </div>
      <input
        type="text"
        name="title_en"
        defaultValue={experience?.titleEn || ''}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
        placeholder="Job title (EN)"
      />
      <input
        type="text"
        name="period"
        defaultValue={experience?.period || ''}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
        placeholder="Ex: 2022 - Present"
        required
      />
      <textarea
        name="description"
        defaultValue={experience?.description || ''}
        rows={2}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
        placeholder="Description (FR)..."
      />
      <textarea
        name="description_en"
        defaultValue={experience?.descriptionEn || ''}
        rows={2}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
        placeholder="Description (EN)..."
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary/80 text-background font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : experience ? 'Sauver' : 'Ajouter'}
        </button>
        <button
          type="button"
          onClick={() => {
            setAddingType(null)
            setEditingId(null)
          }}
          className="px-4 py-2 border border-white/10 font-mono text-[10px] text-white/60 uppercase tracking-widest rounded-lg hover:border-white/30 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )

  const renderEducationForm = (edu?: Education) => (
    <form
      onSubmit={edu ? (e) => handleUpdate(e, edu) : handleAdd}
      className={`space-y-3 ${edu ? '' : 'bg-primary/5 border border-primary/20 rounded-lg p-4'}`}
    >
      <input type="hidden" name="type" value="education" />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="degree"
          defaultValue={edu?.degree || ''}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
          placeholder="Diplôme (FR)"
          required
        />
        <input
          type="text"
          name="school"
          defaultValue={edu?.school || ''}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
          placeholder="Établissement"
          required
        />
      </div>
      <input
        type="text"
        name="degree_en"
        defaultValue={edu?.degreeEn || ''}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
        placeholder="Degree (EN)"
      />
      <input
        type="text"
        name="period"
        defaultValue={edu?.period || ''}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
        placeholder="Ex: 2018 - 2022"
        required
      />
      <textarea
        name="description"
        defaultValue={edu?.description || ''}
        rows={2}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
        placeholder="Description (FR)..."
      />
      <textarea
        name="description_en"
        defaultValue={edu?.descriptionEn || ''}
        rows={2}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all resize-none"
        placeholder="Description (EN)..."
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary/80 text-background font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : edu ? 'Sauver' : 'Ajouter'}
        </button>
        <button
          type="button"
          onClick={() => {
            setAddingType(null)
            setEditingId(null)
          }}
          className="px-4 py-2 border border-white/10 font-mono text-[10px] text-white/60 uppercase tracking-widest rounded-lg hover:border-white/30 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )

  const renderTimelineItem = (item: TimelineItem) => {
    const isExperience = item.type === 'experience'
    const exp = item as Experience
    const edu = item as Education

    return (
      <div key={item.id} className="bg-black/20 border border-white/5 rounded-lg p-4">
        {editingId === item.id ? (
          isExperience ? renderExperienceForm(exp) : renderEducationForm(edu)
        ) : (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-mono text-sm text-white">
                  {isExperience ? exp.title : edu.degree}
                </h4>
                <p className="font-mono text-xs text-primary">
                  {isExperience ? exp.company : edu.school}
                </p>
                <p className="font-mono text-[10px] text-white/40 mt-1">{item.period}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingId(item.id)}
                  className="p-2 text-white/40 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isLoading}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            {item.description && (
              <p className="font-mono text-xs text-white/50 line-clamp-2">{item.description}</p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Expériences professionnelles
        </h3>
        
        <div className="space-y-2">
          {experiences.map(renderTimelineItem)}
        </div>

        {addingType === 'experience' ? (
          renderExperienceForm()
        ) : (
          <button
            onClick={() => setAddingType('experience')}
            className="w-full px-4 py-2.5 border border-dashed border-white/20 rounded-lg font-mono text-[10px] text-white/50 uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
          >
            + Ajouter une expérience
          </button>
        )}
      </div>

      <div className="border-t border-white/10" />

      <div className="space-y-3">
        <h3 className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          Formation
        </h3>
        
        <div className="space-y-2">
          {education.map(renderTimelineItem)}
        </div>

        {addingType === 'education' ? (
          renderEducationForm()
        ) : (
          <button
            onClick={() => setAddingType('education')}
            className="w-full px-4 py-2.5 border border-dashed border-white/20 rounded-lg font-mono text-[10px] text-white/50 uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
          >
            + Ajouter une formation
          </button>
        )}
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
    </div>
  )
}
