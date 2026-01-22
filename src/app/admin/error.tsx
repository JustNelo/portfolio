'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="font-heading text-2xl text-white mb-2">
          Erreur Admin
        </h1>
        <p className="font-mono text-sm text-white/60 mb-6">
          {process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Une erreur est survenue dans l\'administration.'}
        </p>
        
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary/80 text-background font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Réessayer l'opération"
        >
          Réessayer
        </button>

        {error.digest && (
          <p className="mt-6 font-mono text-[10px] text-white/30">
            Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
