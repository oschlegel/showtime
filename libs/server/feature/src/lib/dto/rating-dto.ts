import { z } from 'zod';

export const RatingDtoZod = z.object({
  source: z.string(),
  value: z.string(),
});

export type RatingDto = z.infer<typeof RatingDtoZod>;
