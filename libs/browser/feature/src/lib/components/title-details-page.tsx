'use client';
import { EpisodeDto, SeriesDto } from '@showtime/server-feature';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { userSessionService } from '../services/user-session-service';
import { trpc } from '../trpc';
import { ApplicationHeader } from './application-header';

interface TitleDetailsPageProps {
  id: string;
}

export const TitleDetailsPage: FC<TitleDetailsPageProps> = ({ id }) => {
  const { push } = useRouter();
  const titleQuery = trpc.title.getTitle.useQuery(id);
  const isSeries = titleQuery.data?.type === 'series';
  const seasonsQuery = trpc.title.getSeasons.useQuery(
    {
      id,
      seasonIds: isSeries
        ? Array(parseInt((titleQuery.data as SeriesDto).totalSeasons))
            .fill(null)
            .map((_, index) => index + 1)
        : [],
    },
    { enabled: isSeries }
  );
  const markAsFavouriteMutation = trpc.title.markAsFavourite.useMutation();
  const unmarkAsFavouriteMutation = trpc.title.unmarkAsFavourite.useMutation();
  const markAsWatchedMutation = trpc.title.markAsWatched.useMutation();
  const unmarkAsWatchedMutation = trpc.title.unmarkAsWatched.useMutation();

  useEffect(() => {
    const userSession = userSessionService.getUserSession();
    if (!userSession) {
      push('/login');
      return;
    }
  });

  const onFavouriteClick = async () => {
    if (!titleQuery.data) {
      return;
    }
    const mutation = titleQuery.data.favourite
      ? unmarkAsFavouriteMutation
      : markAsFavouriteMutation;
    mutation.mutate(id, {
      onSuccess: () => {
        titleQuery.refetch();
      },
    });
  };

  const onWatchedClick = async () => {
    if (!titleQuery.data || titleQuery.data.type !== 'movie') {
      return;
    }
    const mutation = titleQuery.data.watched
      ? unmarkAsWatchedMutation
      : markAsWatchedMutation;
    mutation.mutate(id, {
      onSuccess: () => {
        titleQuery.refetch();
      },
    });
  };

  const onEpisodeWatchedClick = async (episode: EpisodeDto) => {
    const mutation = episode.watched
      ? unmarkAsWatchedMutation
      : markAsWatchedMutation;
    mutation.mutate(episode.imdbId, {
      onSuccess: () => {
        seasonsQuery.refetch();
      },
    });
  };

  return (
    <div>
      <ApplicationHeader />
      <h1>TitleDetailsPage</h1>
      {titleQuery.data && (
        <>
          <label htmlFor="favourite">Favourite</label>
          <input
            type="checkbox"
            id="favourite"
            name="favourite"
            checked={titleQuery.data.favourite}
            onChange={() => onFavouriteClick()}
          />

          {titleQuery.data.type === 'movie' && (
            <>
              <label htmlFor="watched">Watched</label>
              <input
                type="checkbox"
                id="watched"
                name="watched"
                checked={titleQuery.data.watched}
                onChange={() => onWatchedClick()}
              />
            </>
          )}

          <pre>{JSON.stringify(titleQuery.data, null, 2)}</pre>
        </>
      )}

      {isSeries && (
        <>
          <h2>Seasons</h2>

          {seasonsQuery.isLoading && <span>Loading...</span>}

          {seasonsQuery.data?.map((season) => (
            <div key={season.season}>
              <h3>Season {season.season}</h3>

              {season.episodes.map((episode) => (
                <div key={episode.imdbId}>
                  <h4>Episode {episode.episode}</h4>

                  <label
                    htmlFor={`s${season.season}-e${episode.episode}-watched`}
                  >
                    Watched
                  </label>
                  <input
                    type="checkbox"
                    id={`s${season.season}-e${episode.episode}-watched`}
                    name={`s${season.season}-e${episode.episode}-watched`}
                    checked={episode.watched}
                    onChange={() => onEpisodeWatchedClick(episode)}
                  />

                  <pre>{JSON.stringify(episode, null, 2)}</pre>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
