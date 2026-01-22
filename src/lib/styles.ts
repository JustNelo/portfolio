/**
 * Centralized Tailwind CSS class definitions for consistent styling.
 * Reduces duplication across components and ensures design system consistency.
 */

/**
 * Input field styles
 */
export const inputStyles = {
  base: 'w-full bg-white/5 backdrop-blur-xl border rounded-lg font-mono text-sm transition-all duration-200 placeholder:text-white/30 focus:outline-none',
  variants: {
    default: 'border-white/10 text-white/90 focus:border-primary/50 focus:bg-white/10',
    error: 'border-red-500/50 text-white/90 focus:border-red-500',
  },
  sizes: {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-3.5 text-sm',
  },
} as const

/**
 * Button styles
 */
export const buttonStyles = {
  base: 'inline-flex items-center justify-center font-mono uppercase tracking-widest rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    primary: 'bg-primary/80 text-background hover:bg-primary focus:ring-primary/50',
    secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white/20',
    ghost: 'border border-white/10 text-white/60 hover:border-white/30 hover:text-white/80 focus:ring-white/20',
    danger: 'bg-red-500/80 text-white hover:bg-red-500 focus:ring-red-500/50',
  },
  sizes: {
    sm: 'px-3 py-1.5 text-[9px]',
    md: 'px-4 py-2 text-[10px]',
    lg: 'px-6 py-3 text-xs',
  },
} as const

/**
 * Card styles
 */
export const cardStyles = {
  base: 'rounded-xl border transition-all duration-200',
  variants: {
    default: 'bg-white/5 border-white/10 backdrop-blur-xl',
    elevated: 'bg-white/5 border-white/10 backdrop-blur-xl hover:border-white/20 hover:bg-white/10',
    interactive: 'bg-white/5 border-white/10 backdrop-blur-xl hover:border-primary/30 cursor-pointer',
  },
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
} as const

/**
 * Label styles
 */
export const labelStyles = {
  base: 'block font-mono uppercase tracking-widest mb-2',
  sizes: {
    sm: 'text-[9px]',
    md: 'text-[10px]',
  },
  variants: {
    default: 'text-white/40',
    required: 'text-white/40 after:content-["*"] after:text-primary after:ml-0.5',
  },
} as const

/**
 * Badge/Tag styles
 */
export const badgeStyles = {
  base: 'inline-flex items-center font-mono uppercase tracking-wider rounded-full',
  variants: {
    default: 'bg-white/10 text-white/60',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
  },
  sizes: {
    sm: 'px-2 py-0.5 text-[8px]',
    md: 'px-3 py-1 text-[10px]',
  },
} as const

/**
 * Utility function to combine style classes
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Build input class string from options
 */
export function getInputClasses(options?: {
  variant?: keyof typeof inputStyles.variants
  size?: keyof typeof inputStyles.sizes
  className?: string
}): string {
  const { variant = 'default', size = 'lg', className } = options || {}
  return cn(
    inputStyles.base,
    inputStyles.variants[variant],
    inputStyles.sizes[size],
    className
  )
}

/**
 * Build button class string from options
 */
export function getButtonClasses(options?: {
  variant?: keyof typeof buttonStyles.variants
  size?: keyof typeof buttonStyles.sizes
  className?: string
}): string {
  const { variant = 'primary', size = 'md', className } = options || {}
  return cn(
    buttonStyles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes[size],
    className
  )
}
