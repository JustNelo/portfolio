'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSceneStore } from '@/stores/useSceneStore'
import { useTranslations } from 'next-intl'
import { LoaderBackground } from './LoaderBackground'
import { LoaderProgress } from './LoaderProgress'
import { LoaderDecorations } from './LoaderDecorations'

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
          <LoaderBackground />
          
          <LoaderProgress 
            showReady={showReady}
            statusText={{
              init: t('loader.init'),
              ready: t('loader.ready'),
            }}
          />
          
          <LoaderDecorations
            calibrationText={t('loader.calibration')}
            titleLines={[t('loader.text_1'), t('loader.text_2')]}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
