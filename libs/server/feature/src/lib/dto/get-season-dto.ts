import { z } from 'zod';

export const GetSeasonDtoZod = z.object({
  id: z.string(),
  seasonId: z.number(),
});

export type TitleGetSeasonDto = z.infer<typeof GetSeasonDtoZod>;
