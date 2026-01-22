'use client'

import { useState } from 'react'
import { addTimelineItem, updateTimelineItem, deleteTimelineItem } from '@/lib/actions/about'
import type { TimelineItem, Experience, Education } from '@/lib/validations/about'
import { TimelineSection } from './timeline'

interface TimelineManagerProps {
  initialTimeline: TimelineItem[]
}

const ExperienceIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const EducationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
)

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

  const handleCancel = () => {
    setAddingType(null)
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <TimelineSection
        title="Expériences professionnelles"
        icon={<ExperienceIcon />}
        type="experience"
        items={experiences}
        editingId={editingId}
        isAdding={addingType === 'experience'}
        isLoading={isLoading}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onStartAdd={() => setAddingType('experience')}
        onStartEdit={setEditingId}
        onCancel={handleCancel}
      />

      <div className="border-t border-white/10" />

      <TimelineSection
        title="Formation"
        icon={<EducationIcon />}
        type="education"
        items={education}
        editingId={editingId}
        isAdding={addingType === 'education'}
        isLoading={isLoading}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onStartAdd={() => setAddingType('education')}
        onStartEdit={setEditingId}
        onCancel={handleCancel}
      />

      {message && (
        <div
          role="alert"
          aria-live="polite"
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
