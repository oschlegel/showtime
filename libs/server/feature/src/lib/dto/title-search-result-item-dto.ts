import { z } from 'zod';

export const TitleSearchResultItemDtoZod = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  imdbId: z.string(),
  type: z.string(),
  poster: z.string(),
  favourite: z.boolean(),
});

export type TitleSearchResultItemDto = z.infer<
  typeof TitleSearchResultItemDtoZod
>;
