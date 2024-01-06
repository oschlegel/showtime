import { z } from 'zod';

export const GetSeasonsDtoZod = z.object({
  id: z.string(),
  seasonIds: z.array(z.number()),
});

export type TitleGetSeasonsDto = z.infer<typeof GetSeasonsDtoZod>;
