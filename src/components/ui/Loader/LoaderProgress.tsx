'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface LoaderProgressProps {
  showReady: boolean
  statusText: {
    init: string
    ready: string
  }
}

/**
 * Central progress bar with segmented HUD style and status text.
 */
export function LoaderProgress({ showReady, statusText }: LoaderProgressProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
      {/* Status text */}
      <motion.div
        className="font-mono text-xs uppercase tracking-[0.3em] text-white/60"
        style={{ textShadow: '0 0 15px rgba(255,255,255,0.4)' }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {showReady ? (
            <motion.span
              key="ready"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white font-medium"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)' }}
            >
              {statusText.ready}
            </motion.span>
          ) : (
            <motion.span
              key="loading"
              exit={{ opacity: 0, y: -5 }}
            >
              {statusText.init}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Segmented bar container */}
      <div className="flex items-center gap-1">
        {/* Left bracket */}
        <div className="text-white/50 font-mono text-lg mr-1" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>[</div>
        
        {/* Segments */}
        <div className="flex gap-0.5">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 md:w-6 h-3 border border-white/20"
              initial={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              animate={showReady ? {
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderColor: 'rgba(255,255,255,0.8)',
              } : {
                backgroundColor: [
                  'rgba(255,255,255,0.05)',
                  'rgba(255,255,255,0.4)',
                  'rgba(255,255,255,0.6)',
                  'rgba(255,255,255,0.4)',
                  'rgba(255,255,255,0.05)',
                ],
                borderColor: [
                  'rgba(255,255,255,0.2)',
                  'rgba(255,255,255,0.5)',
                  'rgba(255,255,255,0.8)',
                  'rgba(255,255,255,0.5)',
                  'rgba(255,255,255,0.2)',
                ],
              }}
              transition={showReady ? {
                duration: 0.3,
                delay: i * 0.05,
              } : {
                duration: 3,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Right bracket */}
        <div className="text-white/50 font-mono text-lg ml-1" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>]</div>
      </div>

      {/* Subtle scanline under bar */}
      <motion.div
        className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  )
}
