import { z } from 'zod';
import { RatingDtoZod } from './rating-dto';

export const EpisodeDtoZod = z.object({
  title: z.string(),
  year: z.string(),
  rated: z.string(),
  released: z.string(),
  season: z.string(),
  episode: z.string(),
  runtime: z.string(),
  genre: z.string(),
  director: z.string(),
  writer: z.string(),
  actors: z.string(),
  plot: z.string(),
  language: z.string(),
  country: z.string(),
  awards: z.string(),
  poster: z.string(),
  ratings: z.array(RatingDtoZod),
  metascore: z.string(),
  imdbRating: z.string(),
  imdbVotes: z.string(),
  imdbId: z.string(),
  seriesId: z.string(),
  type: z.literal('episode'),
  watched: z.boolean(),
});

export type EpisodeDto = z.infer<typeof EpisodeDtoZod>;
