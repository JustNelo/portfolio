'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSceneStore } from '@/stores/useSceneStore'
import DecodeText from '@/components/animations/DecodeText'

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-white/10"
      style={{ willChange: 'transform' }}
      initial={{ y: '-50vh' }}
      animate={{ y: '50vh' }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export default function Loader() {
  const canReveal = useSceneStore((state) => state.canReveal)
  const [isVisible, setIsVisible] = useState(true)
  const [showReady, setShowReady] = useState(false)

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
          style={{ willChange: 'opacity' }}
        >
          <ScanLine />
          
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm tracking-[0.2em] text-white"
              style={{ willChange: 'transform, opacity' }}
            >
              <DecodeText 
                text="INITIALIZING SYSTEM" 
                duration={0.5}
                delay={0.3}
                ignoreLoader
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-48 h-px bg-neutral-800 overflow-hidden origin-left"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Progress bar uses scaleX instead of width to avoid layout thrashing */}
              <motion.div
                className="absolute inset-y-0 left-0 w-full bg-white origin-left"
                style={{ willChange: 'transform' }}
                animate={{ 
                  scaleX: canReveal ? 1 : [0, 0.4, 0.2, 0.6, 0.35],
                }}
                transition={canReveal ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] } : {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase h-4"
            >
              <AnimatePresence mode="wait">
                {showReady ? (
                  <motion.span
                    key="ready"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-white"
                  >
                    READY
                  </motion.span>
                ) : (
                  <motion.span
                    key="loading"
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    Compiling shaders...
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
