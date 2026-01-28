'use client'

import { useEffect, useState, useRef } from 'react'

const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
const MOBILE_BREAKPOINT = 768
const THROTTLE_MS = 150

interface DeviceInfo {
  isMobile: boolean
  isSmallScreen: boolean
}

/**
 * Detects device type and screen size.
 * Combines user agent detection with responsive breakpoint check.
 * Throttled resize listener to prevent excessive re-renders.
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isSmallScreen: false
  })
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = MOBILE_REGEX.test(navigator.userAgent)
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT
      setDeviceInfo({
        isMobile: isMobileDevice || isSmallScreen,
        isSmallScreen
      })
    }
    
    const throttledCheck = () => {
      if (throttleRef.current) return
      throttleRef.current = setTimeout(() => {
        checkDevice()
        throttleRef.current = null
      }, THROTTLE_MS)
    }
    
    checkDevice()
    window.addEventListener('resize', throttledCheck, { passive: true })
    return () => {
      window.removeEventListener('resize', throttledCheck)
      if (throttleRef.current) clearTimeout(throttleRef.current)
    }
  }, [])

  return deviceInfo
}

/**
 * Simple hook that returns true if device is mobile or screen is small.
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceDetection()
  return isMobile
}
