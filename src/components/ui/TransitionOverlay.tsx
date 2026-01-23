'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useTransitionStore } from '@/store/useTransitionStore'

export default function TransitionOverlay() {
  const { isTransitioning, endTransition } = useTransitionStore()
  const pathname = usePathname()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname
      const timer = setTimeout(() => {
        endTransition()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname, endTransition])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="transition-overlay"
          className="fixed inset-0 z-50 pointer-events-none bg-black/30 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
