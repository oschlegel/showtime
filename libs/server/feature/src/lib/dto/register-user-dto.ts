import { z } from 'zod';

export const RegisterUserDtoZod = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type RegisterUserDto = z.infer<typeof RegisterUserDtoZod>;
