'use client'

import { useState, useCallback, useEffect } from 'react'
import { generateSlug } from '@/lib/validations/project'

export interface MediaPreview {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

export interface ProjectFormState {
  title: string
  slug: string
  slugManuallyEdited: boolean
  description: string
  year: number
  category: string
  agency: string
  client: string
  responsibilities: string[]
  responsibilityInput: string
  development: string
  externalUrl: string
  medias: MediaPreview[]
}

export interface ProjectFormActions {
  setTitle: (value: string) => void
  setSlug: (value: string) => void
  setDescription: (value: string) => void
  setYear: (value: number) => void
  setCategory: (value: string) => void
  setAgency: (value: string) => void
  setClient: (value: string) => void
  setResponsibilityInput: (value: string) => void
  addResponsibility: () => void
  removeResponsibility: (index: number) => void
  setDevelopment: (value: string) => void
  setExternalUrl: (value: string) => void
  setMedias: (medias: MediaPreview[]) => void
  resetForm: () => void
  buildFormData: () => FormData
  cleanupPreviews: () => void
}

export interface SubmitState {
  loading: boolean
  message: { type: 'success' | 'error'; text: string } | null
  setLoading: (value: boolean) => void
  setMessage: (message: { type: 'success' | 'error'; text: string } | null) => void
}

const initialState: ProjectFormState = {
  title: '',
  slug: '',
  slugManuallyEdited: false,
  description: '',
  year: new Date().getFullYear(),
  category: '',
  agency: '',
  client: '',
  responsibilities: [],
  responsibilityInput: '',
  development: '',
  externalUrl: '',
  medias: [],
}

/**
 * Hook for managing project form state in admin
 * Handles all form fields, media previews, and form submission
 */
export function useProjectForm(): ProjectFormState & ProjectFormActions & SubmitState {
  // Form state
  const [title, setTitleState] = useState(initialState.title)
  const [slug, setSlugState] = useState(initialState.slug)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(initialState.slugManuallyEdited)
  const [description, setDescription] = useState(initialState.description)
  const [year, setYear] = useState(initialState.year)
  const [category, setCategory] = useState(initialState.category)
  const [agency, setAgency] = useState(initialState.agency)
  const [client, setClient] = useState(initialState.client)
  const [responsibilities, setResponsibilities] = useState<string[]>(initialState.responsibilities)
  const [responsibilityInput, setResponsibilityInput] = useState(initialState.responsibilityInput)
  const [development, setDevelopment] = useState(initialState.development)
  const [externalUrl, setExternalUrl] = useState(initialState.externalUrl)
  const [medias, setMedias] = useState<MediaPreview[]>(initialState.medias)

  // Submit state
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlugState(generateSlug(title))
    }
  }, [title, slugManuallyEdited])

  const setTitle = useCallback((value: string) => {
    setTitleState(value)
  }, [])

  const setSlug = useCallback((value: string) => {
    setSlugManuallyEdited(true)
    setSlugState(value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }, [])

  const addResponsibility = useCallback(() => {
    if (responsibilityInput.trim()) {
      setResponsibilities(prev => [...prev, responsibilityInput.trim()])
      setResponsibilityInput('')
    }
  }, [responsibilityInput])

  const removeResponsibility = useCallback((index: number) => {
    setResponsibilities(prev => prev.filter((_, i) => i !== index))
  }, [])

  const cleanupPreviews = useCallback(() => {
    medias.forEach(m => URL.revokeObjectURL(m.preview))
  }, [medias])

  const resetForm = useCallback(() => {
    cleanupPreviews()
    setTitleState(initialState.title)
    setSlugState(initialState.slug)
    setSlugManuallyEdited(initialState.slugManuallyEdited)
    setDescription(initialState.description)
    setYear(initialState.year)
    setCategory(initialState.category)
    setAgency(initialState.agency)
    setClient(initialState.client)
    setResponsibilities(initialState.responsibilities)
    setResponsibilityInput(initialState.responsibilityInput)
    setDevelopment(initialState.development)
    setExternalUrl(initialState.externalUrl)
    setMedias(initialState.medias)
    setMessage(null)
  }, [cleanupPreviews])

  const buildFormData = useCallback((): FormData => {
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

    // Append media files in order
    medias.forEach((media) => {
      formData.append('medias', media.file)
    })

    return formData
  }, [title, slug, description, year, category, agency, client, responsibilities, development, externalUrl, medias])

  return {
    // State
    title,
    slug,
    slugManuallyEdited,
    description,
    year,
    category,
    agency,
    client,
    responsibilities,
    responsibilityInput,
    development,
    externalUrl,
    medias,
    // Actions
    setTitle,
    setSlug,
    setDescription,
    setYear,
    setCategory,
    setAgency,
    setClient,
    setResponsibilityInput,
    addResponsibility,
    removeResponsibility,
    setDevelopment,
    setExternalUrl,
    setMedias,
    resetForm,
    buildFormData,
    cleanupPreviews,
    // Submit state
    loading,
    message,
    setLoading,
    setMessage,
  }
}

export default useProjectForm
