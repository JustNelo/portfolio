'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'

export interface MediaPreview {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

interface MediaUploaderProps {
  medias: MediaPreview[]
  onMediasChange: (medias: MediaPreview[]) => void
}

export default function MediaUploader({ medias, onMediasChange }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newMedias: MediaPreview[] = []

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (!isImage && !isVideo) return

      const preview = URL.createObjectURL(file)
      newMedias.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        type: isVideo ? 'video' : 'image',
      })
    })

    onMediasChange([...medias, ...newMedias])
  }, [medias, onMediasChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [handleFiles])

  const removeMedia = useCallback((id: string) => {
    const mediaToRemove = medias.find(m => m.id === id)
    if (mediaToRemove) {
      URL.revokeObjectURL(mediaToRemove.preview)
    }
    onMediasChange(medias.filter(m => m.id !== id))
  }, [medias, onMediasChange])

  const moveMedia = useCallback((index: number, direction: 'up' | 'down') => {
    const newMedias = [...medias]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= medias.length) return
    [newMedias[index], newMedias[newIndex]] = [newMedias[newIndex], newMedias[index]]
    onMediasChange(newMedias)
  }, [medias, onMediasChange])

  return (
    <div className="space-y-4">
      <label className="font-mono text-[10px] text-muted uppercase tracking-widest block">
        Médias
      </label>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-none p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border-medium hover:border-primary/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="space-y-2">
          <div className="font-mono text-sm text-muted">
            {isDragging ? 'Déposez les fichiers ici' : 'Glissez-déposez vos images/vidéos'}
          </div>
          <div className="font-mono text-xs text-muted/60">
            ou cliquez pour sélectionner
          </div>
        </div>
      </div>

      {/* Preview grid */}
      {medias.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {medias.map((media, index) => (
            <div key={media.id} className="relative group aspect-video bg-card overflow-hidden">
              {media.type === 'image' ? (
                <Image
                  src={media.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  src={media.preview}
                  className="w-full h-full object-cover"
                  muted
                />
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Order controls */}
                <button
                  type="button"
                  onClick={() => moveMedia(index, 'up')}
                  disabled={index === 0}
                  className="p-2 font-mono text-xs text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="font-mono text-xs text-muted">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => moveMedia(index, 'down')}
                  disabled={index === medias.length - 1}
                  className="p-2 font-mono text-xs text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  →
                </button>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeMedia(media.id)}
                  className="absolute top-2 right-2 p-1 font-mono text-xs text-red-500 hover:bg-red-500/10"
                >
                  ✕
                </button>
              </div>

              {/* Type badge */}
              <div className="absolute bottom-2 left-2 font-mono text-[9px] text-primary/80 bg-background/80 px-1.5 py-0.5 uppercase">
                {media.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
