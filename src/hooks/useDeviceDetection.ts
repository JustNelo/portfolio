'use client'

import { useEffect, useState } from 'react'

const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
const MOBILE_BREAKPOINT = 768

interface DeviceInfo {
  isMobile: boolean
  isSmallScreen: boolean
}

/**
 * Detects device type and screen size.
 * Combines user agent detection with responsive breakpoint check.
 * 
 * @returns Object containing isMobile (device OR small screen) and isSmallScreen flags
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isSmallScreen: false
  })

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = MOBILE_REGEX.test(navigator.userAgent)
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT
      setDeviceInfo({
        isMobile: isMobileDevice || isSmallScreen,
        isSmallScreen
      })
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
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
