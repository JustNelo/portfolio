import { FadeIn, DecodeText } from '@/components/animations'

interface ProjectHeaderProps {
  title: string
}

export default function ProjectHeader({ title }: ProjectHeaderProps) {
  return (
    <FadeIn>
      <DecodeText
        text={title}
        as="h1"
        className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-primary uppercase tracking-tight leading-[0.9]"
        duration={0.5}
        delay={0.1}
      />
    </FadeIn>
  )
}
