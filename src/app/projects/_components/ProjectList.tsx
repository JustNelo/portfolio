'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DecodeText } from '@/components/animations'
import type { Project } from '@/types'

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <nav className="flex flex-col gap-2">
      {projects.map((project, index) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className="group relative py-2"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-muted w-8">
              {String(index + 1).padStart(2, '0')}
            </span>
            
            <div className="flex-1">
              {hoveredIndex === index ? (
                <DecodeText
                  key={`decode-${project.id}-${hoveredIndex}`}
                  text={project.title}
                  as="span"
                  className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary uppercase tracking-tight"
                  duration={0.3}
                  ignoreLoader
                />
              ) : (
                <span className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">
                  {project.title}
                </span>
              )}
            </div>

            <span className="font-mono text-xs text-muted hidden sm:block">
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-12 right-0 h-px bg-border group-hover:bg-border-medium transition-colors" />
        </Link>
      ))}
    </nav>
  )
}
