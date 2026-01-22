'use client'

import { useEffect } from 'react'
import { Link } from '@/lib/i18n/navigation'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Project page error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
          Oops!
        </h1>
        <p className="font-mono text-sm text-muted mb-6">
          Une erreur s'est produite lors du chargement du projet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-primary text-background font-mono text-sm uppercase tracking-widest hover:opacity-80 transition-all"
          >
            Réessayer
          </button>
          <Link
            href="/projects"
            className="px-5 py-2.5 border border-white/20 text-white/80 font-mono text-sm uppercase tracking-widest hover:border-white/40 transition-all"
          >
            Retour aux projets
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left text-xs text-red-400 overflow-auto">
            {error.message}
          </pre>
        )}
      </div>
    </main>
  )
}
