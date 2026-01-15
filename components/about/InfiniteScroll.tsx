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
      infinite: true,
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
        {/* Original content */}
        <div className="ui-about-content pt-16">
          <div className="">
            <div className="grid grid-cols-12 md:grid-cols-24 gap-16">
              <div className="col-span-12 sm:col-span-5 sm:col-start-7 md:col-span-10 md:col-start-12">
                {children}
              </div>
            </div>
          </div>
        </div>
        {/* Clone for seamless loop */}
        <div className="ui-about-content ui-about-content--clone pt-16">
          <div className="">
            <div className="grid grid-cols-12 md:grid-cols-24 gap-16">
              <div className="col-span-12 sm:col-span-5 sm:col-start-7 md:col-span-10 md:col-start-12">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
