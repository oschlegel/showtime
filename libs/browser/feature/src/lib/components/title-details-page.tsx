'use client';
import { SeriesDto } from '@showtime/server-feature';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { userSessionService } from '../services/user-session-service';
import { trpc } from '../trpc';
import { ApplicationHeader } from './application-header';
import { SeasonDetails } from './season-details';

interface TitleDetailsPageProps {
  id: string;
}

export const TitleDetailsPage: FC<TitleDetailsPageProps> = ({ id }) => {
  const { push } = useRouter();
  const titleQuery = trpc.title.getTitle.useQuery(id);
  const isSeries = titleQuery.data?.type === 'series';
  const seasonIds = isSeries
    ? Array(parseInt((titleQuery.data as SeriesDto).totalSeasons))
        .fill(null)
        .map((_, index) => index + 1)
    : [];
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

          {seasonIds.map((seasonId) => (
            <SeasonDetails
              key={`${id}-${seasonId}`}
              titleId={id}
              seasonId={seasonId}
            />
          ))}
        </>
      )}
    </div>
  );
};
