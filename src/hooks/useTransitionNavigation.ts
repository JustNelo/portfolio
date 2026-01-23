'use client'

import { useRouter } from '@/lib/i18n/navigation'
import { useCallback } from 'react'
import { useTransitionStore } from '@/store/useTransitionStore'

const TRANSITION_DURATION = 400

export function useTransitionNavigation() {
  const router = useRouter()
  const { startTransition, isTransitioning } = useTransitionStore()

  const navigate = useCallback(
    (href: string) => {
      if (isTransitioning) return

      startTransition()

      setTimeout(() => {
        router.push(href)
      }, TRANSITION_DURATION)
    },
    [router, startTransition, isTransitioning]
  )

  return { navigate, isTransitioning }
}
