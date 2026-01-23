'use client'

import { forwardRef } from 'react'
import { getInputClasses, labelStyles, cn } from '@/lib/styles'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  langSuffix?: string
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  langSuffix?: string
}

const labelClasses = cn(labelStyles.base, labelStyles.sizes.md, labelStyles.variants.default)

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput({ label, langSuffix, id, ...props }, ref) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div>
        <label htmlFor={inputId} className={labelClasses}>
          {label} {langSuffix && `(${langSuffix})`}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={getInputClasses()}
          {...props}
        />
      </div>
    )
  }
)

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea({ label, langSuffix, id, rows = 4, ...props }, ref) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div>
        <label htmlFor={inputId} className={labelClasses}>
          {label} {langSuffix && `(${langSuffix})`}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={getInputClasses({ className: 'resize-none' })}
          {...props}
        />
      </div>
    )
  }
)
