'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { generateSlug } from '@/lib/validations/project'
import { createProject, updateProject } from '@/lib/actions/project'
import { useImageCompression } from './ImageCompressor'
import { toast } from './Toaster'
import {
  LanguageTabs,
  FormInput,
  FormTextarea,
  ResponsibilitiesInput,
  MediaUploader,
  type MediaPreview,
} from './project-form'
import type { ProjectWithMedias } from '@/types'

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
      <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />

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
      <ResponsibilitiesInput
        responsibilities={activeLang === 'fr' ? responsibilities : responsibilitiesEn}
        inputValue={activeLang === 'fr' ? responsibilityInput : responsibilityInputEn}
        onInputChange={(value) => activeLang === 'fr' ? setResponsibilityInput(value) : setResponsibilityInputEn(value)}
        onAdd={() => addResponsibility(activeLang)}
        onRemove={(index) => removeResponsibility(index, activeLang)}
        langSuffix={activeLang === 'en' ? 'EN' : undefined}
        placeholder={activeLang === 'en' ? 'Ex: Creative Direction (EN)' : 'Ex: Creative Direction'}
      />

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
      <MediaUploader
        medias={medias}
        onMediasChange={setMedias}
        onFilesAdd={handleFiles}
        progressBar={<ProgressBar />}
      />

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
