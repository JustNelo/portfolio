'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <h1 className="font-heading text-6xl text-primary mb-4">Oops!</h1>
        <h2 className="font-heading text-xl text-foreground mb-4">
          Une erreur est survenue
        </h2>
        <p className="font-mono text-sm text-muted mb-8">
          {process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Une erreur inattendue s\'est produite.'}
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-background font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Réessayer le chargement de la page"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-white/20 text-foreground font-mono text-xs uppercase tracking-widest rounded-lg hover:border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Accueil
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-[10px] text-muted/50">
            Code erreur: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}
