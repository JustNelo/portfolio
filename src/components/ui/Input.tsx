import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// INPUT VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const baseStyles = 
  'w-full bg-white/5 backdrop-blur-xl border rounded-lg font-mono text-sm transition-all duration-200 placeholder:text-white/30 focus:outline-none'

const variants = {
  default: 'border-white/10 text-white/90 focus:border-primary/50 focus:bg-white/10',
  error: 'border-red-500/50 text-white/90 focus:border-red-500',
} as const

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3.5 text-sm',
  lg: 'px-5 py-4 text-base',
} as const

type Variant = keyof typeof variants
type Size = keyof typeof sizes

// ─────────────────────────────────────────────────────────────────────────────
// INPUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: Variant
  size?: Size
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'default', size = 'md', error, ...props }, ref) => {
    const computedVariant = error ? 'error' : variant
    
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`${baseStyles} ${variants[computedVariant]} ${sizes[size]} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─────────────────────────────────────────────────────────────────────────────
// TEXTAREA COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: Variant
  size?: Size
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', variant = 'default', size = 'md', error, ...props }, ref) => {
    const computedVariant = error ? 'error' : variant
    
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`${baseStyles} ${variants[computedVariant]} ${sizes[size]} resize-none ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ─────────────────────────────────────────────────────────────────────────────
// LABEL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`font-mono text-[10px] text-white/50 uppercase tracking-widest block mb-2 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-primary ml-1">*</span>}
    </label>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM FIELD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, required, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  )
}

export default Input
