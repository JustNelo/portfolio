'use client'

/**
 * Minimal fallback while Scene/WebGL loads.
 * Shows immediately, replaced by 3D scene when ready.
 */
export default function SceneFallback() {
  return (
    <div 
      className="fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
    />
  )
}
