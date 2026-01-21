'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToasterState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

let toasterState: ToasterState | null = null

export function toast(type: Toast['type'], message: string) {
  if (toasterState) {
    toasterState.addToast({ type, message })
  }
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    toasterState = {
      toasts,
      addToast: (toast) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        setToasts((prev) => [...prev, { ...toast, id }])
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 4000)
      },
      removeToast: (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }
    return () => {
      toasterState = null
    }
  }, [toasts])

  if (!mounted) return null

  return createPortal(
    <div className="fixed bottom-20 lg:bottom-4 right-4 left-4 sm:left-auto z-60 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            px-4 py-3.5 font-mono text-sm flex items-center gap-3 animate-slide-in
            backdrop-blur-xl rounded-xl shadow-xl
            ${t.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/10' : ''}
            ${t.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-red-500/10' : ''}
            ${t.type === 'info' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-blue-500/10' : ''}
          `}
        >
          {t.type === 'success' && (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {t.type === 'error' && (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.type === 'info' && (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => toasterState?.removeToast(t.id)}
            className="p-1 opacity-60 hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
