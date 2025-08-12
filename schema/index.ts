import { z } from 'zod'

export const checkUserNameSchema = z.object({
    username: z.string().min(1).max(20)
})

export type checkUserNameSchemaType = z.infer<typeof checkUserNameSchema>