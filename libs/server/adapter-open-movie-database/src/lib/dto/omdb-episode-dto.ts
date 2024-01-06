import { OmdbRatingDto } from './omdb-rating-dto';

export interface OmdbEpisodeDto {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Season: string;
  Episode: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRatingDto[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  seriesID: string;
  Type: 'episode';
  Response: string;
}
