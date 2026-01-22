'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'

export interface MediaPreview {
  id: string
  file?: File
  preview: string
  type: 'image' | 'video'
  isExisting?: boolean
}

interface MediaUploaderProps {
  medias: MediaPreview[]
  onMediasChange: (medias: MediaPreview[]) => void
  onFilesAdd: (files: FileList) => void
  progressBar?: React.ReactNode
}

export default function MediaUploader({
  medias,
  onMediasChange,
  onFilesAdd,
  progressBar,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files) {
        onFilesAdd(e.dataTransfer.files)
      }
    },
    [onFilesAdd]
  )

  const removeMedia = useCallback(
    (id: string) => {
      const mediaToRemove = medias.find((m) => m.id === id)
      if (mediaToRemove && !mediaToRemove.isExisting) {
        URL.revokeObjectURL(mediaToRemove.preview)
      }
      onMediasChange(medias.filter((m) => m.id !== id))
    },
    [medias, onMediasChange]
  )

  const moveMedia = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newMedias = [...medias]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= medias.length) return
      ;[newMedias[index], newMedias[newIndex]] = [newMedias[newIndex], newMedias[index]]
      onMediasChange(newMedias)
    },
    [medias, onMediasChange]
  )

  return (
    <div className="space-y-4">
      <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block">
        Médias
      </label>

      {progressBar}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('media-input')?.click()}
        role="button"
        tabIndex={0}
        aria-label="Zone de dépôt pour les médias"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('media-input')?.click()
          }
        }}
        className={`
          border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/10 backdrop-blur-xl' 
            : 'border-white/20 hover:border-primary/50 hover:bg-white/5 backdrop-blur-xl'
          }
        `}
      >
        <input
          id="media-input"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => e.target.files && onFilesAdd(e.target.files)}
          className="hidden"
        />
        <div className="space-y-2">
          <svg className="w-10 h-10 mx-auto text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="font-mono text-sm text-white/60">
            {isDragging ? 'Déposez les fichiers ici' : 'Glissez-déposez vos images/vidéos'}
          </div>
          <div className="font-mono text-xs text-white/30">
            Images auto-compressées en WebP (max 1920px, 1MB)
          </div>
        </div>
      </div>

      {/* Preview grid */}
      {medias.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4" role="list" aria-label="Médias du projet">
          {medias.map((media, index) => (
            <div 
              key={media.id} 
              role="listitem"
              className="relative group aspect-video bg-black/30 rounded-lg overflow-hidden border border-white/10"
            >
              {media.type === 'image' ? (
                <Image
                  src={media.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <video src={media.preview} className="w-full h-full object-cover" muted />
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => moveMedia(index, 'up')}
                  disabled={index === 0}
                  aria-label="Déplacer vers la gauche"
                  className="p-2.5 font-mono text-xs text-white hover:text-primary hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ←
                </button>
                <span className="font-mono text-xs text-white/60 px-2">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => moveMedia(index, 'down')}
                  disabled={index === medias.length - 1}
                  aria-label="Déplacer vers la droite"
                  className="p-2.5 font-mono text-xs text-white hover:text-primary hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => removeMedia(media.id)}
                  aria-label={`Supprimer le média ${index + 1}`}
                  className="absolute top-2 right-2 p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Type badge */}
              <div className="absolute bottom-2 left-2 font-mono text-[9px] text-white/80 bg-black/60 backdrop-blur-sm px-2 py-1 rounded uppercase">
                {media.isExisting ? 'existing' : 'new'} · {media.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
