'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSceneStore } from '@/stores/useSceneStore'
import { useTranslations } from 'next-intl'

export default function Loader() {
  const canReveal = useSceneStore((state) => state.canReveal)
  const [isVisible, setIsVisible] = useState(true)
  const [showReady, setShowReady] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    if (canReveal) {
      setShowReady(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [canReveal])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-black overflow-hidden"
          style={{ willChange: 'opacity' }}
        >
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
            {t('loader.calibration')}
          </motion.div>

          {/* Center progress bar - Segmented HUD style */}
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
                    {t('loader.ready')}
                  </motion.span>
                ) : (
                  <motion.span
                    key="loading"
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {t('loader.init')}
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
              {t('loader.text_1')}<br />
              {t('loader.text_2')}<br />
            </motion.h1>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/20" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/20" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/20" />

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

          {/* Ambient top glow */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.04) 0%, transparent 60%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
