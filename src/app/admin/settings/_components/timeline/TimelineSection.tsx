'use client'

import type { TimelineItem } from '@/lib/validations/about'
import TimelineItemCard from './TimelineItemCard'
import TimelineForm from './TimelineForm'

interface TimelineSectionProps {
  title: string
  icon: React.ReactNode
  type: 'experience' | 'education'
  items: TimelineItem[]
  editingId: string | null
  isAdding: boolean
  isLoading: boolean
  onAdd: (e: React.FormEvent<HTMLFormElement>) => void
  onUpdate: (e: React.FormEvent<HTMLFormElement>, item: TimelineItem) => void
  onDelete: (id: string) => void
  onStartAdd: () => void
  onStartEdit: (id: string) => void
  onCancel: () => void
}

export default function TimelineSection({
  title,
  icon,
  type,
  items,
  editingId,
  isAdding,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
  onStartAdd,
  onStartEdit,
  onCancel,
}: TimelineSectionProps) {
  const addButtonText = type === 'experience' 
    ? '+ Ajouter une expérience' 
    : '+ Ajouter une formation'

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-2">
        {icon}
        {title}
      </h3>
      
      <div className="space-y-2">
        {items.map((item) => (
          <TimelineItemCard
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            isLoading={isLoading}
            onEdit={() => onStartEdit(item.id)}
            onDelete={() => onDelete(item.id)}
            onUpdate={(e) => onUpdate(e, item)}
            onCancel={onCancel}
          />
        ))}
      </div>

      {isAdding ? (
        <TimelineForm
          type={type}
          isLoading={isLoading}
          onSubmit={onAdd}
          onCancel={onCancel}
        />
      ) : (
        <button
          onClick={onStartAdd}
          className="w-full px-4 py-2.5 border border-dashed border-white/20 rounded-lg font-mono text-[10px] text-white/50 uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
        >
          {addButtonText}
        </button>
      )}
    </div>
  )
}
