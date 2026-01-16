'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'
import type { FadeDirection, ContainerElement } from '@/types'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: FadeDirection
  distance?: number
  once?: boolean
  as?: ContainerElement
}

const QUART_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const getDirectionOffset = (direction: FadeDirection, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance }
    case 'down': return { y: -distance }
    case 'left': return { x: distance }
    case 'right': return { x: -distance }
    case 'none': return {}
  }
}

/**
 * Fade-in animation wrapper using Framer Motion.
 * Uses transform and opacity only to avoid layout thrashing.
 */
export default function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  once = true,
  as: Tag = 'div'
}: FadeInProps) {
  const MotionTag = motion[Tag] as typeof motion.div

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getDirectionOffset(direction, distance)
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0
    }
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: QUART_OUT
      }}
    >
      {children}
    </MotionTag>
  )
}
