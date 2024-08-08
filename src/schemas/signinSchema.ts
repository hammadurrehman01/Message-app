import { z } from 'zod'

export const emailValidation = z
  .string()
  .email({ message: 'Invalid email address' })
  .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)

export const passwordValidation = z.string().min(6, 'Username must be at least 6 characters')

export const signinSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
})
