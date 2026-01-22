'use client'

import { useState } from 'react'
import { addSkill, updateSkill, deleteSkill } from '@/lib/actions/about'
import type { Skill } from '@/lib/validations/about'

interface SkillsManagerProps {
  initialSkills: Skill[]
}

export default function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [newItems, setNewItems] = useState<string[]>([''])
  const [editItems, setEditItems] = useState<string[]>([])

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const filteredItems = newItems.filter((item) => item.trim() !== '')
    formData.set('items', JSON.stringify(filteredItems))
    formData.set('order', String(skills.length))

    const result = await addSkill(formData)
    if (result.success && result.data) {
      setSkills([...skills, result.data])
      setIsAdding(false)
      setNewItems([''])
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, skill: Skill) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const filteredItems = editItems.filter((item) => item.trim() !== '')
    formData.set('id', skill.id)
    formData.set('items', JSON.stringify(filteredItems))
    formData.set('order', String(skill.order))

    const result = await updateSkill(formData)
    if (result.success) {
      setSkills(skills.map(s => s.id === skill.id ? {
        ...s,
        category: formData.get('category') as string,
        categoryEn: (formData.get('category_en') as string) || '',
        items: filteredItems,
      } : s))
      setEditingId(null)
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie de compétences ?')) return
    setIsLoading(true)

    const result = await deleteSkill(id)
    if (result.success) {
      setSkills(skills.filter((s) => s.id !== id))
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setIsLoading(false)
  }

  const startEditing = (skill: Skill) => {
    setEditingId(skill.id)
    setEditItems([...skill.items])
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-black/20 border border-white/5 rounded-lg p-4"
          >
            {editingId === skill.id ? (
              <form onSubmit={(e) => handleUpdate(e, skill)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="category"
                    defaultValue={skill.category}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Catégorie (FR)"
                    required
                  />
                  <input
                    type="text"
                    name="category_en"
                    defaultValue={skill.categoryEn}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Category (EN)"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      Compétences
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditItems([...editItems, ''])}
                      className="font-mono text-[10px] text-primary hover:text-primary/80 uppercase tracking-widest"
                    >
                      + Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newArr = [...editItems]
                            newArr[index] = e.target.value
                            setEditItems(newArr)
                          }}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1.5 font-mono text-xs text-white w-24 focus:outline-none focus:border-primary/50 transition-all"
                          placeholder="Skill"
                        />
                        {editItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setEditItems(editItems.filter((_, i) => i !== index))}
                            className="text-red-400/60 hover:text-red-400"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-primary">{skill.category}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(skill)}
                      className="p-2 text-white/40 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      disabled={isLoading}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-white/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleAdd} className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="category"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
              placeholder="Ex: Frontend (FR)"
              required
            />
            <input
              type="text"
              name="category_en"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
              placeholder="Ex: Frontend (EN)"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                Compétences
              </span>
              <button
                type="button"
                onClick={() => setNewItems([...newItems, ''])}
                className="font-mono text-[10px] text-primary hover:text-primary/80 uppercase tracking-widest"
              >
                + Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newArr = [...newItems]
                      newArr[index] = e.target.value
                      setNewItems(newArr)
                    }}
                    className="bg-white/5 border border-white/10 rounded px-2 py-1.5 font-mono text-xs text-white w-24 placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Skill"
                  />
                  {newItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setNewItems(newItems.filter((_, i) => i !== index))}
                      className="text-red-400/60 hover:text-red-400"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              onClick={() => {
                setIsAdding(false)
                setNewItems([''])
              }}
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
          + Ajouter une catégorie
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
