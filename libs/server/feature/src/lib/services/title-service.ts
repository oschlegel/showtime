import {
  Favourite,
  Watch,
  databaseService,
} from '@showtime/server-adapter-database';
import {
  OmdbEpisodeDto,
  OmdbMovieDto,
  OmdbSearchResultItemDto,
  OmdbSeasonDto,
  OmdbSeriesDto,
  openMovieDatabaseService,
} from '@showtime/server-adapter-open-movie-database';
import { differenceInMilliseconds } from 'date-fns';
import { EpisodeDto } from '../dto/episode-dto';
import { MovieDto } from '../dto/movie-dto';
import { SeasonDto } from '../dto/season-dto';
import { SeriesDto } from '../dto/series-dto';
import { TitleDto } from '../dto/title-dto';
import { TitleSearchResultDto } from '../dto/title-search-result-dto';
import { TitleSearchResultItemDto } from '../dto/title-search-result-item-dto';

const titleChacheTTL = 24 * 60 * 60 * 1000;

const getFavourites = async (userId: number): Promise<TitleDto[]> => {
  const favourites = await databaseService.getFavouritesByUserId(userId);
  const watches = await databaseService.getWatchesByUserId(userId);
  const titles = await Promise.all(
    favourites.map((favourite) => getTitleCached(favourite.titleId))
  );

  return titles.map((title, index) => {
    const favourite = favourites[index];
    const watch = watches.find((watch) => watch.titleId === favourite.titleId);
    if (title.Type === 'movie') {
      return toMovieDto(title, favourite, watch);
    } else if (title.Type === 'series') {
      return toSeriesDto(title, favourite);
    } else {
      throw new Error(`Unsupported title type: ${title.Type}`);
    }
  });
};

const getTitle = async (titleId: string, userId: number): Promise<TitleDto> => {
  const [title, favourite, watch] = await Promise.all([
    getTitleCached(titleId),
    databaseService.getFavourite(titleId, userId),
    databaseService.getWatch(titleId, userId),
  ]);

  if (title.Type === 'movie') {
    return toMovieDto(title, favourite, watch);
  } else if (title.Type === 'series') {
    return toSeriesDto(title, favourite);
  } else {
    throw new Error(`Unsupported title type: ${title.Type}`);
  }
};

const getTitleCached = async (
  id: string
): Promise<OmdbEpisodeDto | OmdbMovieDto | OmdbSeriesDto> => {
  const titleEntity = await databaseService.getTitle(id);

  if (!titleEntity) {
    const result = await openMovieDatabaseService.getTitleByImdbId(id);
    await databaseService.createTitle({
      data: result,
      id: result.imdbID,
    });
    return result;
  }

  if (
    (titleEntity.updatedAt &&
      differenceInMilliseconds(new Date(), titleEntity.updatedAt) >
        titleChacheTTL) ||
    (!titleEntity.updatedAt &&
      differenceInMilliseconds(new Date(), titleEntity.createdAt) >
        titleChacheTTL)
  ) {
    const resultPromise = openMovieDatabaseService.getTitleByImdbId(id);
    resultPromise.then((result) =>
      databaseService.updateTitle({
        ...titleEntity,
        data: result,
        updatedAt: new Date(),
      })
    );
  }

  return titleEntity.data as OmdbMovieDto | OmdbSeriesDto;
};

const getSeason = async (
  id: string,
  seasonId: number,
  userId: number
): Promise<SeasonDto> => {
  const watches = await databaseService.getWatchesByUserId(userId);
  const season = await openMovieDatabaseService.getSeasonByImdbId(id, seasonId);
  const episodeIds = season.Episodes.map((episode) => episode.imdbID);
  const episodes = await Promise.all(
    episodeIds.map((episodeId) => getTitleCached(episodeId))
  );

  return toSeasonDto(season, episodes as OmdbEpisodeDto[], watches);
};

const markAsFavourite = async (
  titleId: string,
  userId: number
): Promise<void> => {
  // Load title to ensure it exists in the database
  await getTitleCached(titleId);
  await databaseService.createFavourite({
    titleId,
    userId,
  });
};

const unmarkAsFavourite = async (
  titleId: string,
  userId: number
): Promise<void> => {
  await databaseService.deleteFavourite(titleId, userId);
};

const markAsWatched = async (
  titleId: string,
  userId: number
): Promise<void> => {
  await databaseService.createWatch({
    titleId,
    userId,
  });
};

const unmarkAsWatched = async (
  titleId: string,
  userId: number
): Promise<void> => {
  await databaseService.deleteWatch(titleId, userId);
};

const search = async (
  search: string,
  userId: number
): Promise<TitleSearchResultDto> => {
  const [result, favourites] = await Promise.all([
    openMovieDatabaseService.search(search, 1),
    databaseService.getFavouritesByUserId(userId),
  ]);

  return {
    items: result.Search.map((item) =>
      toTitleSearchResultItemDto(item, favourites)
    ),
    totalResults: result.totalResults,
  };
};

const toMovieDto = (
  movie: OmdbMovieDto,
  favourite: Favourite | undefined,
  watch: Watch | undefined
): MovieDto => ({
  id: movie.imdbID,
  title: movie.Title,
  year: movie.Year,
  rated: movie.Rated,
  released: movie.Released,
  runtime: movie.Runtime,
  genre: movie.Genre,
  director: movie.Director,
  writer: movie.Writer,
  actors: movie.Actors,
  plot: movie.Plot,
  language: movie.Language,
  country: movie.Country,
  awards: movie.Awards,
  poster: movie.Poster,
  ratings: movie.Ratings.map((rating) => ({
    source: rating.Source,
    value: rating.Value,
  })),
  metascore: movie.Metascore,
  imdbRating: movie.imdbRating,
  imdbVotes: movie.imdbVotes,
  imdbId: movie.imdbID,
  type: movie.Type,
  dvd: movie.DVD,
  boxOffice: movie.BoxOffice,
  production: movie.Production,
  website: movie.Website,
  favourite: !!favourite,
  watched: !!watch,
});

const toSeriesDto = (
  series: OmdbSeriesDto,
  favourite: Favourite | undefined
): SeriesDto => ({
  id: series.imdbID,
  title: series.Title,
  year: series.Year,
  rated: series.Rated,
  released: series.Released,
  runtime: series.Runtime,
  genre: series.Genre,
  director: series.Director,
  writer: series.Writer,
  actors: series.Actors,
  plot: series.Plot,
  language: series.Language,
  country: series.Country,
  awards: series.Awards,
  poster: series.Poster,
  ratings: series.Ratings.map((rating) => ({
    source: rating.Source,
    value: rating.Value,
  })),
  metascore: series.Metascore,
  imdbRating: series.imdbRating,
  imdbVotes: series.imdbVotes,
  imdbId: series.imdbID,
  type: series.Type,
  totalSeasons: series.totalSeasons,
  favourite: !!favourite,
});

const toSeasonDto = (
  season: OmdbSeasonDto,
  episodes: OmdbEpisodeDto[],
  watches: Watch[]
): SeasonDto => ({
  season: season.Season,
  episodes: season.Episodes.map((episode) =>
    toEpisodeDto(episodes.find((e) => e.imdbID === episode.imdbID)!, watches)
  ),
});

const toEpisodeDto = (
  episode: OmdbEpisodeDto,
  watches: Watch[]
): EpisodeDto => ({
  title: episode.Title,
  year: episode.Year,
  rated: episode.Rated,
  released: episode.Released,
  season: episode.Season,
  episode: episode.Episode,
  runtime: episode.Runtime,
  genre: episode.Genre,
  director: episode.Director,
  writer: episode.Writer,
  actors: episode.Actors,
  plot: episode.Plot,
  language: episode.Language,
  country: episode.Country,
  awards: episode.Awards,
  poster: episode.Poster,
  ratings: episode.Ratings.map((rating) => ({
    source: rating.Source,
    value: rating.Value,
  })),
  metascore: episode.Metascore,
  imdbRating: episode.imdbRating,
  imdbVotes: episode.imdbVotes,
  imdbId: episode.imdbID,
  seriesId: episode.seriesID,
  type: episode.Type,
  watched: watches.some((watch) => watch.titleId === episode.imdbID),
});

const toTitleSearchResultItemDto = (
  omdbSearchResultItemDto: OmdbSearchResultItemDto,
  favourites: Favourite[]
): TitleSearchResultItemDto => ({
  id: omdbSearchResultItemDto.imdbID,
  imdbId: omdbSearchResultItemDto.imdbID,
  title: omdbSearchResultItemDto.Title,
  year: omdbSearchResultItemDto.Year,
  type: omdbSearchResultItemDto.Type,
  poster: omdbSearchResultItemDto.Poster,
  favourite: favourites.some(
    (favourite) => favourite.titleId === omdbSearchResultItemDto.imdbID
  ),
});

export const titleService = {
  getFavourites,
  getTitle,
  getSeason,
  markAsFavourite,
  unmarkAsFavourite,
  markAsWatched,
  unmarkAsWatched,
  search,
};
