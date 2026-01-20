'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

const DEFAULT_CHARS = '0123456789ABCDEF!@#$%&<>[]'
const DEFAULT_DURATION = 0.3
const DEFAULT_SCRAMBLE_SPEED = 25 // ms between character changes

export interface UseScrambleOptions {
  /** Characters to use for scrambling */
  chars?: string
  /** Animation duration in seconds */
  duration?: number
  /** Delay before starting animation in seconds */
  delay?: number
  /** Speed of character changes in ms (lower = faster/more nervous) */
  scrambleSpeed?: number
  /** Whether to start with scrambled text */
  startScrambled?: boolean
}

export interface UseScrambleReturn {
  /** Current display text (scrambled or final) */
  displayText: string
  /** Whether animation is currently running */
  isAnimating: boolean
  /** Trigger the scramble animation */
  scramble: () => void
  /** Reset to original text without animation */
  reset: () => void
}

/**
 * Hook for scramble/decode text animation
 * Provides a nervous, glitchy text reveal effect
 * 
 * @example
 * ```tsx
 * const { displayText, scramble } = useScramble('HELLO', { duration: 0.5 })
 * 
 * return (
 *   <span onMouseEnter={scramble}>{displayText}</span>
 * )
 * ```
 */
export function useScramble(
  text: string,
  options: UseScrambleOptions = {}
): UseScrambleReturn {
  const {
    chars = DEFAULT_CHARS,
    duration = DEFAULT_DURATION,
    delay = 0,
    scrambleSpeed = DEFAULT_SCRAMBLE_SPEED,
    startScrambled = false,
  } = options

  const [displayText, setDisplayText] = useState(() => 
    startScrambled ? scrambleInitial(text, chars) : text
  )
  const [isAnimating, setIsAnimating] = useState(false)
  
  const rafRef = useRef<number | null>(null)
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastFrameTime = useRef(0)

  const getRandomChar = useCallback(() => {
    return chars[Math.floor(Math.random() * chars.length)]
  }, [chars])

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

  const cleanup = useCallback(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current)
      delayTimeoutRef.current = null
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const runAnimation = useCallback(() => {
    cleanup()
    setIsAnimating(true)
    
    const durationMs = duration * 1000
    let startTime: number | null = null
    
    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
        lastFrameTime.current = timestamp
        setDisplayText(scrambleText(0))
      }
      
      // Throttle updates for nervous effect
      if (timestamp - lastFrameTime.current >= scrambleSpeed) {
        lastFrameTime.current = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / durationMs, 1)
        
        if (progress >= 1) {
          setDisplayText(text)
          setIsAnimating(false)
          rafRef.current = null
          return
        }
        
        setDisplayText(scrambleText(progress))
      }
      
      rafRef.current = requestAnimationFrame(animate)
    }
    
    rafRef.current = requestAnimationFrame(animate)
  }, [cleanup, duration, scrambleSpeed, scrambleText, text])

  const scramble = useCallback(() => {
    if (delay > 0) {
      delayTimeoutRef.current = setTimeout(runAnimation, delay * 1000)
    } else {
      runAnimation()
    }
  }, [delay, runAnimation])

  const reset = useCallback(() => {
    cleanup()
    setDisplayText(text)
    setIsAnimating(false)
  }, [cleanup, text])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Update display text if source text changes
  useEffect(() => {
    if (!isAnimating) {
      setDisplayText(text)
    }
  }, [text, isAnimating])

  return {
    displayText,
    isAnimating,
    scramble,
    reset,
  }
}

/**
 * Generate initial scrambled text
 */
function scrambleInitial(text: string, chars: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === ' ') return ' '
      return chars[Math.floor(Math.random() * chars.length)]
    })
    .join('')
}

export default useScramble
