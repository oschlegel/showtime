import { OmdbSeasonEpisodeDto } from './omdb-season-episode-dto';

export interface OmdbSeasonDto {
  Title: string;
  Season: string;
  totalSeasons: string;
  Episodes: OmdbSeasonEpisodeDto[];
  Response: string;
}
