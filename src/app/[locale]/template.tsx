'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useTransitionStore } from '@/store/useTransitionStore'

interface TemplateProps {
  children: ReactNode
}

export default function Template({ children }: TemplateProps) {
  const pathname = usePathname()
  const isTransitioning = useTransitionStore((state) => state.isTransitioning)

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.4, delay: isTransitioning ? 0 : 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
