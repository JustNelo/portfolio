'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useSceneStore, getHasCompletedFirstLoad } from '@/stores/useSceneStore'
import { useScramble } from '@/hooks'
import type { TextElement } from '@/types'

interface DecodeTextProps {
  text: string
  className?: string
  duration?: number
  delay?: number
  as?: TextElement
  style?: React.CSSProperties
  once?: boolean
  ignoreLoader?: boolean
  hoverTrigger?: boolean
}

export default function DecodeText({
  text,
  className = '',
  duration = 0.3,
  delay = 0,
  as: Tag = 'span',
  style,
  once = true,
  ignoreLoader = false,
  hoverTrigger = false
}: DecodeTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  const isLoaderGone = useSceneStore((state) => state.isLoaderGone)
  
  const [isMounted, setIsMounted] = useState(false)
  const hasAnimated = useRef(false)
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { displayText, scramble, isAnimating } = useScramble(text, {
    duration,
    startScrambled: !hoverTrigger,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Determine if we can animate (loader check)
  const canAnimate = ignoreLoader || isLoaderGone || getHasCompletedFirstLoad()
  const shouldTrigger = isMounted && isInView && canAnimate

  // Initial animation on appear
  useEffect(() => {
    if (hoverTrigger) return
    if (!shouldTrigger || hasAnimated.current) return
    
    hasAnimated.current = true
    
    if (delay > 0) {
      delayTimeoutRef.current = setTimeout(scramble, delay * 1000)
    } else {
      scramble()
    }
    
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current)
        delayTimeoutRef.current = null
      }
    }
  }, [shouldTrigger, delay, hoverTrigger, scramble])

  // Hover animation
  const handleMouseEnter = () => {
    if (hoverTrigger && !isAnimating) {
      scramble()
    }
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLSpanElement & HTMLHeadingElement & HTMLParagraphElement & HTMLDivElement>}
      className={`font-mono ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </Tag>
  )
}
