import { z } from 'zod';
import { TitleSearchResultItemDtoZod } from './title-search-result-item-dto';

export const TitleSearchResultDtoZod = z.object({
  items: z.array(TitleSearchResultItemDtoZod),
  totalResults: z.string(),
});

export type TitleSearchResultDto = z.infer<typeof TitleSearchResultDtoZod>;
