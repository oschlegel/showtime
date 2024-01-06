import { OmdbRatingDto } from './omdb-rating-dto';

export interface OmdbMovieDto {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
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
  Type: 'movie';
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
