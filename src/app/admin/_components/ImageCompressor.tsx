'use client'

import imageCompression from 'browser-image-compression'
import { useState, useCallback } from 'react'

export interface CompressionProgress {
  current: number
  total: number
  percentage: number
}

interface ImageCompressorOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
}

const defaultOptions: ImageCompressorOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
}

export async function compressImage(
  file: File,
  options: ImageCompressorOptions = {}
): Promise<File> {
  if (file.type.startsWith('video/')) {
    return file
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const compressedBlob = await imageCompression(file, {
      maxSizeMB: mergedOptions.maxSizeMB!,
      maxWidthOrHeight: mergedOptions.maxWidthOrHeight!,
      useWebWorker: mergedOptions.useWebWorker!,
      fileType: mergedOptions.fileType as 'image/webp',
    })

    const newFileName = file.name.replace(/\.[^/.]+$/, '.webp')
    return new File([compressedBlob], newFileName, { type: 'image/webp' })
  } catch (error) {
    console.error('Compression failed for:', file.name, error)
    return file
  }
}

export async function compressImages(
  files: File[],
  onProgress?: (progress: CompressionProgress) => void,
  options: ImageCompressorOptions = {}
): Promise<File[]> {
  const compressedFiles: File[] = []
  const total = files.length

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const compressed = await compressImage(file, options)
    compressedFiles.push(compressed)

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100),
      })
    }
  }

  return compressedFiles
}

interface CompressionProgressBarProps {
  progress: CompressionProgress | null
  isCompressing: boolean
}

export function CompressionProgressBar({ progress, isCompressing }: CompressionProgressBarProps) {
  if (!isCompressing || !progress) return null

  return (
    <div className="space-y-2">
      <div className="flex justify-between font-mono text-[10px] text-muted uppercase tracking-widest">
        <span>Compression des images...</span>
        <span>{progress.current}/{progress.total}</span>
      </div>
      <div className="h-1 bg-border-medium overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  )
}

export function useImageCompression() {
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState<CompressionProgress | null>(null)

  const compress = useCallback(async (files: File[], options?: ImageCompressorOptions) => {
    setIsCompressing(true)
    setProgress({ current: 0, total: files.length, percentage: 0 })

    try {
      const compressed = await compressImages(files, setProgress, options)
      return compressed
    } finally {
      setIsCompressing(false)
      setProgress(null)
    }
  }, [])

  return {
    compress,
    isCompressing,
    progress,
    ProgressBar: () => <CompressionProgressBar progress={progress} isCompressing={isCompressing} />,
  }
}
