'use client'

import { Component, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Reusable error boundary for graceful error handling in client components.
 * Catches JavaScript errors in child component tree and displays fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div 
          role="alert"
          className="p-6 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <h2 className="font-mono text-sm text-red-400 uppercase tracking-widest mb-2">
            Une erreur est survenue
          </h2>
          <p className="font-mono text-xs text-white/60">
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Minimal fallback for 3D scene errors (WebGL failures, etc.)
 */
export function SceneErrorFallback() {
  const t = useTranslations('a11y')
  
  return (
    <div 
      className="fixed inset-0 -z-10 bg-background flex items-center justify-center"
      role="alert"
      aria-label={t('sceneError')}
    >
      <div className="text-center">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
          {t('sceneUnavailable')}
        </p>
      </div>
    </div>
  )
}
