import { OmdbSearchResultItemDto } from './omdb-search-result-item-dto';

export interface OmdbSearchResultDto {
  Search: OmdbSearchResultItemDto[];
  totalResults: string;
  Response: string;
}
