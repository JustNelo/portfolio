'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    />
  )
}
