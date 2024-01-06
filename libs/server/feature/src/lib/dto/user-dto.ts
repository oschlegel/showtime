import { z } from 'zod';

export const UserDtoZod = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

export type UserDto = z.infer<typeof UserDtoZod>;
