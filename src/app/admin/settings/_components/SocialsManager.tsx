'use client'

import { useState } from 'react'
import { addSocial, updateSocial, deleteSocial } from '@/lib/actions/about'
import type { Social } from '@/lib/validations/about'

interface SocialsManagerProps {
  initialSocials: Social[]
}

export default function SocialsManager({ initialSocials }: SocialsManagerProps) {
  const [socials, setSocials] = useState<Social[]>(initialSocials)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('order', String(socials.length))

    const result = await addSocial(formData)
    if (result.success && result.data) {
      setSocials([...socials, result.data])
      setIsAdding(false)
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, social: Social) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('id', social.id)
    formData.set('order', String(social.order))

    const result = await updateSocial(formData)
    if (result.success) {
      setSocials(socials.map(s => s.id === social.id ? {
        ...s,
        name: formData.get('name') as string,
        href: formData.get('href') as string,
      } : s))
      setEditingId(null)
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce lien social ?')) return
    setIsLoading(true)

    const result = await deleteSocial(id)
    if (result.success) {
      setSocials(socials.filter((s) => s.id !== id))
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {socials.map((social) => (
          <div
            key={social.id}
            className="bg-black/20 border border-white/5 rounded-lg p-3"
          >
            {editingId === social.id ? (
              <form onSubmit={(e) => handleUpdate(e, social)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    defaultValue={social.name}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Nom"
                    required
                  />
                  <input
                    type="text"
                    name="href"
                    defaultValue={social.href}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Lien"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-primary/80 text-background font-mono text-[10px] uppercase tracking-widest rounded hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    Sauver
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 border border-white/10 font-mono text-[10px] text-white/60 uppercase tracking-widest rounded hover:border-white/30 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm text-white">{social.name}</span>
                  <span className="font-mono text-xs text-white/40 ml-3 truncate max-w-50 inline-block align-middle">
                    {social.href}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingId(social.id)}
                    className="p-2 text-white/40 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(social.id)}
                    disabled={isLoading}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleAdd} className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="name"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
              placeholder="Ex: LinkedIn"
              required
            />
            <input
              type="text"
              name="href"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
              placeholder="https://..."
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary/80 text-background font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-white/10 font-mono text-[10px] text-white/60 uppercase tracking-widest rounded-lg hover:border-white/30 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full px-4 py-3 border border-dashed border-white/20 rounded-lg font-mono text-xs text-white/50 uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
        >
          + Ajouter un lien social
        </button>
      )}

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
