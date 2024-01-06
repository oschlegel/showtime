import { z } from 'zod';
import { EpisodeDtoZod } from './episode-dto';

export const SeasonDtoZod = z.object({
  season: z.string(),
  episodes: z.array(EpisodeDtoZod),
});

export type SeasonDto = z.infer<typeof SeasonDtoZod>;
