'use client'

import { motion, type Variants, useInView } from 'framer-motion'
import { type ReactNode, useRef, useEffect, useState } from 'react'
import type { FadeDirection, ContainerElement } from '@/types'
import { useSceneStore, getHasCompletedFirstLoad } from '@/stores/useSceneStore'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: FadeDirection
  distance?: number
  once?: boolean
  as?: ContainerElement
  ignoreLoader?: boolean
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
 * Properly handles Next.js navigation by using useInView hook.
 * Waits for loader to finish on first visit.
 */
export default function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  once = true,
  as: Tag = 'div',
  ignoreLoader = false
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  const isLoaderGone = useSceneStore((state) => state.isLoaderGone)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  const MotionTag = motion[Tag] as typeof motion.div
  
  // Wait for loader to be completely gone before animating
  // Also skip check if user already completed first load (soft navigation)
  const canAnimate = ignoreLoader || isLoaderGone || getHasCompletedFirstLoad()

  // Track when animation should trigger
  useEffect(() => {
    if (isInView && canAnimate && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, canAnimate, hasAnimated])

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
      ref={ref}
      className={className}
      initial="hidden"
      animate={hasAnimated ? 'visible' : 'hidden'}
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
