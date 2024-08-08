import { z } from 'zod'

export const codeValidation = z.string().length(6, 'Verification code must be at least 6 digits')

export const verifySchema = z.object({
  code: codeValidation,
})
