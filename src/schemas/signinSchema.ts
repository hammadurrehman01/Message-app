import { z } from 'zod'

export const emailValidation = z
  .string()
  .email({ message: 'Invalid email address' })

export const passwordValidation = z.string().min(6, 'Username must be at least 6 characters')

export const signinSchema = z.object({
  identifier: emailValidation,
  password: passwordValidation,
})
