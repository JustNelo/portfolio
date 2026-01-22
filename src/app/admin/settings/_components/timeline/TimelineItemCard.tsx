'use client'

import type { TimelineItem, Experience, Education } from '@/lib/validations/about'
import TimelineForm from './TimelineForm'

interface TimelineItemCardProps {
  item: TimelineItem
  isEditing: boolean
  isLoading: boolean
  onEdit: () => void
  onDelete: () => void
  onUpdate: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export default function TimelineItemCard({
  item,
  isEditing,
  isLoading,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
}: TimelineItemCardProps) {
  const isExperience = item.type === 'experience'
  const exp = item as Experience
  const edu = item as Education
  const title = isExperience ? exp.title : edu.degree
  const subtitle = isExperience ? exp.company : edu.school

  if (isEditing) {
    return (
      <div className="bg-black/20 border border-white/5 rounded-lg p-4">
        <TimelineForm
          type={item.type}
          item={item}
          isLoading={isLoading}
          onSubmit={onUpdate}
          onCancel={onCancel}
        />
      </div>
    )
  }

  return (
    <div className="bg-black/20 border border-white/5 rounded-lg p-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-mono text-sm text-white">{title}</h4>
            <p className="font-mono text-xs text-primary">{subtitle}</p>
            <p className="font-mono text-[10px] text-white/40 mt-1">{item.period}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              aria-label={`Modifier ${title}`}
              className="p-2 text-white/40 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              disabled={isLoading}
              aria-label={`Supprimer ${title}`}
              className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        {item.description && (
          <p className="font-mono text-xs text-white/50 line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  )
}
