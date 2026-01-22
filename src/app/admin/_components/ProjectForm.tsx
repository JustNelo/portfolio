'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { generateSlug } from '@/lib/validations/project'
import { createProject, updateProject, type ProjectWithMedias } from '@/lib/actions/project'
import { useImageCompression, type CompressionProgress } from './ImageCompressor'
import { toast } from './Toaster'

export interface MediaPreview {
  id: string
  file?: File
  preview: string
  type: 'image' | 'video'
  isExisting?: boolean
}

type Lang = 'fr' | 'en'

interface ProjectFormProps {
  mode: 'create' | 'edit'
  project?: ProjectWithMedias
}

export default function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { compress, isCompressing, ProgressBar } = useImageCompression()
  const [activeLang, setActiveLang] = useState<Lang>('fr')

  // Form state - French (default)
  const [title, setTitle] = useState(project?.title || '')
  const [slug, setSlug] = useState(project?.slug || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')
  const [description, setDescription] = useState(project?.description || '')
  const [year, setYear] = useState(project?.year || new Date().getFullYear())
  const [category, setCategory] = useState(project?.category || '')
  const [agency, setAgency] = useState(project?.agency || '')
  const [client, setClient] = useState(project?.client || '')
  const [responsibilities, setResponsibilities] = useState<string[]>(project?.responsibilities || [])
  const [responsibilityInput, setResponsibilityInput] = useState('')
  const [development, setDevelopment] = useState(project?.development || '')
  const [externalUrl, setExternalUrl] = useState(project?.external_url || '')
  const [medias, setMedias] = useState<MediaPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Form state - English
  const [titleEn, setTitleEn] = useState(project?.title_en || '')
  const [descriptionEn, setDescriptionEn] = useState(project?.description_en || '')
  const [categoryEn, setCategoryEn] = useState(project?.category_en || '')
  const [responsibilitiesEn, setResponsibilitiesEn] = useState<string[]>(project?.responsibilities_en || [])
  const [responsibilityInputEn, setResponsibilityInputEn] = useState('')
  const [developmentEn, setDevelopmentEn] = useState(project?.development_en || '')

  // Initialize medias from project
  useEffect(() => {
    if (project?.project_medias) {
      const existingMedias: MediaPreview[] = project.project_medias
        .sort((a, b) => a.order - b.order)
        .map((m) => ({
          id: m.id,
          preview: m.url,
          type: m.type,
          isExisting: true,
        }))
      setMedias(existingMedias)
    }
  }, [project])

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugManuallyEdited])

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  const addResponsibility = useCallback((lang: Lang) => {
    if (lang === 'fr') {
      if (responsibilityInput.trim()) {
        setResponsibilities((prev) => [...prev, responsibilityInput.trim()])
        setResponsibilityInput('')
      }
    } else {
      if (responsibilityInputEn.trim()) {
        setResponsibilitiesEn((prev) => [...prev, responsibilityInputEn.trim()])
        setResponsibilityInputEn('')
      }
    }
  }, [responsibilityInput, responsibilityInputEn])

  const removeResponsibility = useCallback((index: number, lang: Lang) => {
    if (lang === 'fr') {
      setResponsibilities((prev) => prev.filter((_, i) => i !== index))
    } else {
      setResponsibilitiesEn((prev) => prev.filter((_, i) => i !== index))
    }
  }, [])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
    )

    if (newFiles.length === 0) return

    // Compress images
    const imageFiles = newFiles.filter((f) => f.type.startsWith('image/'))
    const videoFiles = newFiles.filter((f) => f.type.startsWith('video/'))

    let processedFiles = [...videoFiles]

    if (imageFiles.length > 0) {
      const compressedImages = await compress(imageFiles)
      processedFiles = [...processedFiles, ...compressedImages]
    }

    const newMedias: MediaPreview[] = processedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      isExisting: false,
    }))

    setMedias((prev) => [...prev, ...newMedias])
  }, [compress])

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
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const removeMedia = useCallback((id: string) => {
    const mediaToRemove = medias.find((m) => m.id === id)
    if (mediaToRemove && !mediaToRemove.isExisting) {
      URL.revokeObjectURL(mediaToRemove.preview)
    }
    setMedias((prev) => prev.filter((m) => m.id !== id))
  }, [medias])

  const moveMedia = useCallback((index: number, direction: 'up' | 'down') => {
    const newMedias = [...medias]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= medias.length) return
    ;[newMedias[index], newMedias[newIndex]] = [newMedias[newIndex], newMedias[index]]
    setMedias(newMedias)
  }, [medias])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('description', description)
    formData.append('year', year.toString())
    formData.append('category', category)
    formData.append('agency', agency)
    formData.append('client', client)
    formData.append('responsibilities', JSON.stringify(responsibilities))
    formData.append('development', development)
    formData.append('external_url', externalUrl)
    // English translations
    formData.append('title_en', titleEn)
    formData.append('description_en', descriptionEn)
    formData.append('category_en', categoryEn)
    formData.append('responsibilities_en', JSON.stringify(responsibilitiesEn))
    formData.append('development_en', developmentEn)

    if (mode === 'create') {
      // Add all new medias
      medias.forEach((media) => {
        if (media.file) {
          formData.append('medias', media.file)
        }
      })

      startTransition(async () => {
        const result = await createProject(formData)

        if (result.success) {
          toast('success', result.message)
          medias.forEach((m) => {
            if (!m.isExisting) URL.revokeObjectURL(m.preview)
          })
          setTimeout(() => {
            router.push('/admin/projects')
          }, 1500)
        } else {
          toast('error', result.message)
        }
      })
    } else if (mode === 'edit' && project) {
      // Send existing media IDs with their new order
      const existingMediasOrder = medias
        .map((m, index) => ({ id: m.id, order: index, isExisting: m.isExisting }))
        .filter((m) => m.isExisting)
        .map(({ id, order }) => ({ id, order }))
      formData.append('existing_medias_order', JSON.stringify(existingMediasOrder))

      // Add new medias with their order position
      const newMediasWithOrder: { index: number; file: File }[] = []
      medias.forEach((media, index) => {
        if (!media.isExisting && media.file) {
          newMediasWithOrder.push({ index, file: media.file })
        }
      })
      
      // Send new media order separately
      formData.append('new_medias_order', JSON.stringify(newMediasWithOrder.map(m => m.index)))
      
      // Add new media files in order
      newMediasWithOrder.forEach(({ file }) => {
        formData.append('new_medias', file)
      })

      startTransition(async () => {
        const result = await updateProject(project.id, formData)

        if (result.success) {
          toast('success', result.message)
          medias.forEach((m) => {
            if (!m.isExisting) URL.revokeObjectURL(m.preview)
          })
          setTimeout(() => {
            router.push('/admin/projects')
          }, 1500)
        } else {
          toast('error', result.message)
        }
      })
    }
  }

  const isLoading = isPending || isCompressing

  return (
    <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
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

      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Titre {activeLang === 'en' && '(EN)'} *
          </label>
          <input
            type="text"
            value={activeLang === 'fr' ? title : titleEn}
            onChange={(e) => activeLang === 'fr' ? setTitle(e.target.value) : setTitleEn(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
            required={activeLang === 'fr'}
            placeholder={activeLang === 'en' ? 'English title (optional)' : ''}
          />
        </div>
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
            required
            disabled={activeLang === 'en'}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
          Description {activeLang === 'en' && '(EN)'} *
        </label>
        <textarea
          value={activeLang === 'fr' ? description : descriptionEn}
          onChange={(e) => activeLang === 'fr' ? setDescription(e.target.value) : setDescriptionEn(e.target.value)}
          rows={4}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 resize-none placeholder:text-white/30"
          required={activeLang === 'fr'}
          placeholder={activeLang === 'en' ? 'English description (optional)' : ''}
        />
      </div>

      {/* Year & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Année *
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min={2000}
            max={2100}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Catégorie {activeLang === 'en' && '(EN)'} *
          </label>
          <input
            type="text"
            value={activeLang === 'fr' ? category : categoryEn}
            onChange={(e) => activeLang === 'fr' ? setCategory(e.target.value) : setCategoryEn(e.target.value)}
            placeholder={activeLang === 'en' ? 'Category (EN)' : 'Web Design, Branding, etc.'}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
            required={activeLang === 'fr'}
          />
        </div>
      </div>

      {/* Agency & Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Agence
          </label>
          <input
            type="text"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Client
          </label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
          Responsabilités {activeLang === 'en' && '(EN)'}
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={activeLang === 'fr' ? responsibilityInput : responsibilityInputEn}
            onChange={(e) => activeLang === 'fr' ? setResponsibilityInput(e.target.value) : setResponsibilityInputEn(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addResponsibility(activeLang)
              }
            }}
            placeholder={activeLang === 'en' ? 'Ex: Creative Direction (EN)' : 'Ex: Creative Direction'}
            className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={() => addResponsibility(activeLang)}
            className="px-5 py-3.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg font-mono text-sm text-primary hover:bg-primary/20 hover:border-primary/30 transition-all duration-200"
          >
            +
          </button>
        </div>
        {(activeLang === 'fr' ? responsibilities : responsibilitiesEn).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(activeLang === 'fr' ? responsibilities : responsibilitiesEn).map((resp, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg font-mono text-xs text-white/80"
              >
                {resp}
                <button
                  type="button"
                  onClick={() => removeResponsibility(index, activeLang)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Development & External URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            Développement {activeLang === 'en' && '(EN)'}
          </label>
          <input
            type="text"
            value={activeLang === 'fr' ? development : developmentEn}
            onChange={(e) => activeLang === 'fr' ? setDevelopment(e.target.value) : setDevelopmentEn(e.target.value)}
            placeholder={activeLang === 'en' ? 'Ex: Darkroom Engineering (EN)' : 'Ex: Darkroom Engineering'}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
            URL externe
          </label>
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Media Uploader */}
      <div className="space-y-4">
        <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block">
          Médias
        </label>

        {/* Compression progress */}
        <ProgressBar />

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('media-input')?.click()}
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
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="space-y-2">
            <svg className="w-10 h-10 mx-auto text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
            {medias.map((media, index) => (
              <div key={media.id} className="relative group aspect-video bg-black/30 rounded-lg overflow-hidden border border-white/10">
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
                    className="p-2.5 font-mono text-xs text-white hover:text-primary hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ←
                  </button>
                  <span className="font-mono text-xs text-white/60 px-2">{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => moveMedia(index, 'down')}
                    disabled={index === medias.length - 1}
                    className="p-2.5 font-mono text-xs text-white hover:text-primary hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMedia(media.id)}
                    className="absolute top-2 right-2 p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary/90 backdrop-blur-sm text-background font-mono text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? isCompressing
            ? 'Compression en cours...'
            : mode === 'create'
            ? 'Création en cours...'
            : 'Mise à jour en cours...'
          : mode === 'create'
          ? 'Créer le projet'
          : 'Mettre à jour le projet'}
      </button>
    </form>
  )
}
