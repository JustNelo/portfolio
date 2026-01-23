'use client'

import { motion } from 'framer-motion'

/**
 * Animated SVG background with grid lines and orbital arcs.
 */
export function LoaderBackground() {
  return (
    <>
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Background grid and arcs */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {/* Large orbital arc */}
        <motion.ellipse
          cx="50%"
          cy="120%"
          rx="60%"
          ry="80%"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
        />
        <motion.ellipse
          cx="50%"
          cy="130%"
          rx="70%"
          ry="90%"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.5, ease: 'easeOut', delay: 0.2 }}
        />

        {/* Horizontal grid lines */}
        {[...Array(12)].map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={`${8 + i * 8}%`}
            x2="100%"
            y2={`${8 + i * 8}%`}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.05, duration: 0.8 }}
          />
        ))}

        {/* Vertical grid lines */}
        {[...Array(16)].map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${6 + i * 6}%`}
            y1="0"
            x2={`${6 + i * 6}%`}
            y2="100%"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: i * 0.04, duration: 0.8 }}
          />
        ))}

        {/* Diagonal accent line */}
        <motion.line
          x1="0"
          y1="100%"
          x2="40%"
          y2="60%"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </svg>

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/20" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/20" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/20" />

      {/* Ambient top glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.04) 0%, transparent 60%)',
        }}
      />
    </>
  )
}
