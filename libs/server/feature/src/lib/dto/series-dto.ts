import { z } from 'zod';
import { RatingDtoZod } from './rating-dto';

export const SeriesDtoZod = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  rated: z.string(),
  released: z.string(),
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
  type: z.literal('series'),
  totalSeasons: z.string(),
  favourite: z.boolean(),
});

export type SeriesDto = z.infer<typeof SeriesDtoZod>;
