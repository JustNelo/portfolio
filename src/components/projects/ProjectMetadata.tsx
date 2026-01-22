'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/animations'

interface MetadataProps {
  agency?: string | null
  client?: string | null
  responsibilities?: string[]
  development?: string | null
}

export default function ProjectMetadata({ agency, client, responsibilities, development }: MetadataProps) {
  const t = useTranslations('projectDetail')

  return (
    <FadeIn delay={0.2}>
      <div className="mt-8 lg:mt-12 space-y-4">
        {agency && (
          <MetadataItem label={t('agency')} value={agency} />
        )}

        {client && (
          <MetadataItem label={t('client')} value={client} />
        )}

        {responsibilities && responsibilities.length > 0 && (
          <div>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1">
              {t('responsibilities')}
            </span>
            <ul className="space-y-0.5">
              {responsibilities.map((resp) => (
                <li key={resp} className="font-mono text-sm text-primary uppercase tracking-wide">
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {development && (
          <MetadataItem label={t('development')} value={development} />
        )}
      </div>
    </FadeIn>
  )
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1">
        {label}
      </span>
      <span className="font-mono text-sm text-primary uppercase tracking-widest">
        {value}
      </span>
    </div>
  )
}
