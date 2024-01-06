import { z } from 'zod';

export const UserSessionDtoZod = z.object({
  token: z.string(),
  expiresAt: z.date(),
});

export type UserSessionDto = z.infer<typeof UserSessionDtoZod>;
