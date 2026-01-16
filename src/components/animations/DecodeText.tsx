'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useInView } from 'framer-motion'
import { useSceneStore } from '@/stores/useSceneStore'
import type { TextElement } from '@/types'

const CHARS = '0123456789ABCDEF!@#$%&<>[]'
const DEFAULT_DURATION = 0.8
/** Synced with Loader exit animation timing (1.2s wait + 1.2s fade) */
const LOADER_EXIT_DELAY = 2.4

interface DecodeTextProps {
  text: string
  className?: string
  duration?: number
  delay?: number
  as?: TextElement
  style?: React.CSSProperties
  once?: boolean
  ignoreLoader?: boolean
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
  ignoreLoader = false
}: DecodeTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  const isSceneReady = useSceneStore((state) => state.isSceneReady)
  
  // Hydration fix: render final text server-side, scramble only after mount
  const [isMounted, setIsMounted] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const hasAnimated = useRef(false)
  const rafRef = useRef<number | null>(null)
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
    if (!hasAnimated.current) {
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

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return
    
    hasAnimated.current = true
    
    const durationMs = duration * 1000
    let startTime: number | null = null
    
    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
        setDisplayText(scrambleText(0))
      }
      
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      
      if (progress >= 1) {
        setDisplayText(text)
        rafRef.current = null
        return
      }
      
      setDisplayText(scrambleText(progress))
      rafRef.current = requestAnimationFrame(animate)
    }
    
    const startAnimation = () => {
      rafRef.current = requestAnimationFrame(animate)
    }
    
    const totalDelay = ignoreLoader ? delay : delay + LOADER_EXIT_DELAY
    
    if (totalDelay > 0) {
      delayTimeoutRef.current = setTimeout(startAnimation, totalDelay * 1000)
    } else {
      startAnimation()
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
  }, [shouldAnimate, text, duration, delay, scrambleText, ignoreLoader])

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLSpanElement & HTMLHeadingElement & HTMLParagraphElement & HTMLDivElement>}
      className={`font-mono ${className}`}
      style={style}
    >
      {displayText}
    </Tag>
  )
}
