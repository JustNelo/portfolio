'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const t = useTranslations('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-4xl text-primary uppercase tracking-tight mb-8">
          {t('title')}
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
              required
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30"
              required
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary/90 backdrop-blur-sm text-background font-mono text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('loading') : t('submit')}
          </button>
        </form>
      </div>
    </main>
  )
}
