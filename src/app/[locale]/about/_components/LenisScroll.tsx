'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface InfiniteScrollProps {
  children: ReactNode
}

export default function InfiniteScroll({ children }: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const lenis = new Lenis({
      wrapper: container,
      content: content,
      smoothWheel: true,
      duration: 1.2,
      wheelMultiplier: 0.8,
      infinite: false,
    })

    let animationFrameId: number
    function raf(time: number) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }
    animationFrameId = requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div ref={contentRef}>
        <div className="ui-about-content pt-16 sm:pt-20 md:pt-24 2xl:pt-16">
          <div>
            <div className="grid grid-cols-12 2xl:grid-cols-24 gap-4 sm:gap-6 md:gap-8 2xl:gap-16">
              <div className="col-span-12 sm:col-span-10 sm:col-start-2 md:col-span-8 md:col-start-3 2xl:col-span-10 2xl:col-start-13">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
