import { z } from 'zod'

export const acceptMessageValidation = z.boolean()

export const acceptMessageSchema = z.object({
  acceptMessage: acceptMessageValidation,
})
