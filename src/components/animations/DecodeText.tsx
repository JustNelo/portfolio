'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useInView } from 'framer-motion'
import { useSceneStore } from '@/stores/useSceneStore'
import type { TextElement } from '@/types'

const CHARS = '0123456789ABCDEF!@#$%&<>[]'
const DEFAULT_DURATION = 0.3
const LOADER_EXIT_DELAY = 2.4
const SCRAMBLE_SPEED = 25 // ms between character changes

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

function scrambleInitial(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === ' ') return ' '
      return CHARS[Math.floor(Math.random() * CHARS.length)]
    })
    .join('')
}

export default function DecodeText({
  text,
  className = '',
  duration = DEFAULT_DURATION,
  delay = 0,
  as: Tag = 'span',
  style,
  once = true,
  ignoreLoader = false,
  hoverTrigger = false
}: DecodeTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  const isSceneReady = useSceneStore((state) => state.isSceneReady)
  
  const [isMounted, setIsMounted] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const [isHovered, setIsHovered] = useState(false)
  const hasAnimated = useRef(false)
  const rafRef = useRef<number | null>(null)
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastFrameTime = useRef(0)

  useEffect(() => {
    setIsMounted(true)
    if (!hasAnimated.current && !hoverTrigger) {
      setDisplayText(scrambleInitial(text))
    }
  }, [])

  const getRandomChar = useCallback(() => {
    return CHARS[Math.floor(Math.random() * CHARS.length)]
  }, [])

  const scrambleText = useCallback((progress: number): string => {
    return text
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        
        const charProgress = index / text.length
        const revealThreshold = progress * 1.2
        
        if (charProgress < revealThreshold) {
          return char
        }
        
        return getRandomChar()
      })
      .join('')
  }, [text, getRandomChar])

  // ignoreLoader bypasses scene ready check (used by Loader component itself)
  const shouldAnimate = isMounted && isInView && (ignoreLoader || isSceneReady)

  const runAnimation = useCallback((onComplete?: () => void) => {
    const durationMs = duration * 1000
    let startTime: number | null = null
    
    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
        lastFrameTime.current = timestamp
        setDisplayText(scrambleText(0))
      }
      
      // Throttle updates for nervous effect
      if (timestamp - lastFrameTime.current >= SCRAMBLE_SPEED) {
        lastFrameTime.current = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / durationMs, 1)
        
        if (progress >= 1) {
          setDisplayText(text)
          rafRef.current = null
          onComplete?.()
          return
        }
        
        setDisplayText(scrambleText(progress))
      }
      
      rafRef.current = requestAnimationFrame(animate)
    }
    
    rafRef.current = requestAnimationFrame(animate)
  }, [duration, scrambleText, text])

  // Initial animation on appear
  useEffect(() => {
    if (hoverTrigger) return // Skip auto-animation for hover-only mode
    if (!shouldAnimate || hasAnimated.current) return
    
    hasAnimated.current = true
    
    const totalDelay = ignoreLoader ? delay : delay + LOADER_EXIT_DELAY
    
    if (totalDelay > 0) {
      delayTimeoutRef.current = setTimeout(() => runAnimation(), totalDelay * 1000)
    } else {
      runAnimation()
    }
    
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current)
        delayTimeoutRef.current = null
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [shouldAnimate, delay, ignoreLoader, hoverTrigger, runAnimation])

  // Hover animation
  useEffect(() => {
    if (!hoverTrigger || !isHovered) return
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    
    runAnimation()
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isHovered, hoverTrigger, runAnimation])

  const handleMouseEnter = () => {
    if (hoverTrigger) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (hoverTrigger) {
      setIsHovered(false)
    }
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLSpanElement & HTMLHeadingElement & HTMLParagraphElement & HTMLDivElement>}
      className={`font-mono ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </Tag>
  )
}
