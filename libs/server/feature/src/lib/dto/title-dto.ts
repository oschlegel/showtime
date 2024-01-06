import { z } from 'zod';
import { MovieDtoZod } from './movie-dto';
import { SeriesDtoZod } from './series-dto';

export const TitleDtoZod = z.discriminatedUnion('type', [
  MovieDtoZod,
  SeriesDtoZod,
]);

export type TitleDto = z.infer<typeof TitleDtoZod>;
