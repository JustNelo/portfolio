'use client'

import { useState, useCallback, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateSlug } from '@/lib/validations/project'
import { createProject } from '@/lib/actions/project'
import MediaUploader, { type MediaPreview } from './_components/MediaUploader'

export default function NewProjectPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [description, setDescription] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [category, setCategory] = useState('')
  const [agency, setAgency] = useState('')
  const [client, setClient] = useState('')
  const [responsibilities, setResponsibilities] = useState<string[]>([])
  const [responsibilityInput, setResponsibilityInput] = useState('')
  const [development, setDevelopment] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [medias, setMedias] = useState<MediaPreview[]>([])

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

  const addResponsibility = useCallback(() => {
    if (responsibilityInput.trim()) {
      setResponsibilities(prev => [...prev, responsibilityInput.trim()])
      setResponsibilityInput('')
    }
  }, [responsibilityInput])

  const removeResponsibility = useCallback((index: number) => {
    setResponsibilities(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

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

    medias.forEach((media) => {
      formData.append('medias', media.file)
    })

    startTransition(async () => {
      const result = await createProject(formData)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        medias.forEach(m => URL.revokeObjectURL(m.preview))
        setTimeout(() => {
          router.push(`/projects/${result.slug}`)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6 lg:p-8 bg-background/80 backdrop-blur-md border-b border-border-medium">
        <h1 className="font-heading text-2xl sm:text-3xl text-primary uppercase tracking-tight">
          New Project
        </h1>
        <Link
          href="/projects"
          className="font-mono text-[10px] text-muted hover:text-primary transition-colors uppercase tracking-widest"
        >
          ← Back to projects
        </Link>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors resize-none"
              required
            />
          </div>

          {/* Year & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Année *
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={2000}
                max={2100}
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Catégorie *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Web Design, Branding, etc."
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50"
                required
              />
            </div>
          </div>

          {/* Agency & Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Agence
              </label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Client
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
              Responsabilités
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addResponsibility()
                  }
                }}
                placeholder="Ex: Creative Direction"
                className="flex-1 bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50"
              />
              <button
                type="button"
                onClick={addResponsibility}
                className="px-4 py-3 bg-card border border-border-medium font-mono text-sm text-primary hover:bg-primary hover:text-background transition-colors"
              >
                +
              </button>
            </div>
            {responsibilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {responsibilities.map((resp, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-border-medium font-mono text-xs text-primary"
                  >
                    {resp}
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="text-muted hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Development & External URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                Développement
              </label>
              <input
                type="text"
                value={development}
                onChange={(e) => setDevelopment(e.target.value)}
                placeholder="Ex: Darkroom Engineering"
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-2">
                URL externe
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-card border border-border-medium px-4 py-3 font-mono text-sm text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50"
              />
            </div>
          </div>

          {/* Media Uploader */}
          <MediaUploader medias={medias} onMediasChange={setMedias} />

          {/* Message */}
          {message && (
            <div
              className={`p-4 font-mono text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                  : 'bg-red-500/10 text-red-500 border border-red-500/30'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-background font-mono text-sm uppercase tracking-widest py-4 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Création en cours...' : 'Créer le projet'}
          </button>
        </div>
      </form>
    </main>
  )
}
