import type { ZodSchema } from 'zod'

type ValidationSuccess<T> = { success: true; data: T }
type ValidationError = { success: false; message: string }

/**
 * Validates data against a Zod schema.
 * Returns a discriminated union for type-safe error handling.
 */
export function validateFormData<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationSuccess<T> | ValidationError {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join(', ')
    return { success: false, message: `Validation échouée: ${errors}` }
  }
  
  return { success: true, data: result.data }
}
