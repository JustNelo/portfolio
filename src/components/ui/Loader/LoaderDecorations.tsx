'use client'

import { motion } from 'framer-motion'

interface LoaderDecorationsProps {
  calibrationText: string
  titleLines: [string, string]
}

/**
 * Decorative elements: satellite icon, floating particles, and typography.
 */
export function LoaderDecorations({ calibrationText, titleLines }: LoaderDecorationsProps) {
  return (
    <>
      {/* Satellite icon - top left */}
      <motion.div
        className="absolute top-[15%] left-[12%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -8, 0],
          rotate: [0, 3, 0, -3, 0],
        }}
        transition={{ 
          opacity: { duration: 1, delay: 0.5 },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1">
          <rect x="9" y="9" width="6" height="6" />
          <line x1="3" y1="3" x2="9" y2="9" />
          <line x1="15" y1="15" x2="21" y2="21" />
          <line x1="3" y1="21" x2="9" y2="15" />
          <line x1="15" y1="9" x2="21" y2="3" />
        </svg>
      </motion.div>

      {/* Status text - near satellite */}
      <motion.div
        className="absolute top-[16%] left-[16%] font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
        style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        {calibrationText}
      </motion.div>

      {/* Bottom right - Main typography */}
      <div className="absolute bottom-[10%] right-[8%] text-right">
        {/* Subtle glow backdrop */}
        <div 
          className="absolute inset-0 -inset-x-8 -inset-y-4 pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <motion.h1
          className="font-heading text-3xl md:text-5xl lg:text-6xl uppercase tracking-widest text-white/90 leading-tight relative"
          style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {titleLines[0]}<br />
          {titleLines[1]}<br />
        </motion.h1>
      </div>

      {/* Bottom left icon */}
      <motion.div
        className="absolute bottom-[6%] left-[4%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, rotate: [0, 360] }}
        transition={{ 
          opacity: { duration: 1, delay: 2 },
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/40">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      </motion.div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}
