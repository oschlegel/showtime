import { OmdbEpisodeDto } from './dto/omdb-episode-dto';
import { OmdbMovieDto } from './dto/omdb-movie-dto';
import { OmdbSearchResultDto } from './dto/omdb-search-result-dto';
import { OmdbSeasonDto } from './dto/omdb-season-dto';
import { OmdbSeriesDto } from './dto/omdb-series-dto';

const omdbApiKey = process.env.OPEN_MOVIE_DATABASE_API_KEY;

if (!omdbApiKey) {
  throw new Error('OPEN_MOVIE_DATABASE_API_KEY is not defined');
}

const getTitleByImdbId = async (
  ImdbId: string
): Promise<OmdbEpisodeDto | OmdbMovieDto | OmdbSeriesDto> => {
  console.log('openMovieDatabaseService.getTitleByImdbId', ImdbId);
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${ImdbId}`
  );
  return response.json();
};

const getSeasonByImdbId = async (
  ImdbId: string,
  season: number
): Promise<OmdbSeasonDto> => {
  console.log('openMovieDatabaseService.getSeasonByImdbId', ImdbId, season);
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${ImdbId}&season=${season}`
  );
  return response.json();
};

const search = async (
  search: string,
  page: number
): Promise<OmdbSearchResultDto> => {
  console.log('openMovieDatabaseService.findBySearch', search, page);
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${search}&page=${page}`
  );
  return response.json();
};

export const openMovieDatabaseService = {
  getTitleByImdbId,
  getSeasonByImdbId,
  search,
};
