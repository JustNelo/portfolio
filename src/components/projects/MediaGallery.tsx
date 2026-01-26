import Image from 'next/image'
import { FadeIn } from '@/components/animations'
import type { MediaType } from '@/types'

interface GalleryMedia {
  id: string
  url: string
  type: MediaType
  order: number
  alt?: string
  duration?: number
}

interface MediaGalleryProps {
  medias: GalleryMedia[]
  projectTitle: string
}

export default function MediaGallery({ medias, projectTitle }: MediaGalleryProps) {
  if (medias.length === 0) return null

  return (
    <div className="space-y-6 lg:space-y-10">
      {medias.map((media, index) => (
        <FadeIn key={media.id} delay={0.1 + index * 0.03}>
          <MediaItem media={media} projectTitle={projectTitle} isFirst={index === 0} />
        </FadeIn>
      ))}
    </div>
  )
}

function MediaItem({ media, projectTitle, isFirst }: { media: GalleryMedia; projectTitle: string; isFirst: boolean }) {
  return (
    <figure className="group">
      <div className="relative aspect-16/10 bg-card overflow-hidden">
        {media.type === 'image' ? (
          <Image
            src={media.url}
            alt={media.alt || projectTitle}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={isFirst}
            loading={isFirst ? 'eager' : 'lazy'}
          />
        ) : (
          <video
            src={media.url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        {media.duration && (
          <div className="absolute top-4 left-4 font-mono text-sm text-primary">
            {formatDuration(media.duration)}
          </div>
        )}
      </div>
      {media.alt && (
        <figcaption className="mt-4 text-center">
          <span className="font-heading text-lg sm:text-xl text-primary/80 uppercase tracking-wider">
            {media.alt}
          </span>
        </figcaption>
      )}
    </figure>
  )
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
