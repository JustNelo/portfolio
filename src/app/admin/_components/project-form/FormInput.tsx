'use client'

import { forwardRef } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  langSuffix?: string
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  langSuffix?: string
}

const inputClasses = 
  'w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3.5 font-mono text-sm text-white/90 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200 placeholder:text-white/30'

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput({ label, langSuffix, id, ...props }, ref) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div>
        <label 
          htmlFor={inputId}
          className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2"
        >
          {label} {langSuffix && `(${langSuffix})`}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
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
        <label 
          htmlFor={inputId}
          className="font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2"
        >
          {label} {langSuffix && `(${langSuffix})`}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`${inputClasses} resize-none`}
          {...props}
        />
      </div>
    )
  }
)
