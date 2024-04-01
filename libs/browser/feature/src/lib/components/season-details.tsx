import { FC, useState } from 'react';
import { trpc } from '../trpc';
import { EpisodeDto } from '@showtime/server-feature';

interface SeasonDetailsProps {
  titleId: string;
  seasonId: number;
}

export const SeasonDetails: FC<SeasonDetailsProps> = ({
  seasonId,
  titleId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const seasonQuery = trpc.title.getSeason.useQuery(
    { id: titleId, seasonId },
    { enabled: expanded }
  );
  const markAsWatchedMutation = trpc.title.markAsWatched.useMutation();
  const unmarkAsWatchedMutation = trpc.title.unmarkAsWatched.useMutation();

  const onEpisodeWatchedClick = async (episode: EpisodeDto) => {
    const mutation = episode.watched
      ? unmarkAsWatchedMutation
      : markAsWatchedMutation;
    mutation.mutate(episode.imdbId, {
      onSuccess: () => {
        seasonQuery.refetch();
      },
    });
  };

  return (
    <>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide' : 'Show'} Season {seasonId}
      </button>

      {expanded && seasonQuery.isLoading && <span>Loading...</span>}

      {expanded && seasonQuery.data && (
        <div key={seasonQuery.data.season}>
          <h3>Season {seasonQuery.data.season}</h3>

          {seasonQuery.data.episodes.map((episode) => (
            <div key={episode.imdbId}>
              <h4>Episode {episode.episode}</h4>

              <label
                htmlFor={`s${seasonQuery.data.season}-e${episode.episode}-watched`}
              >
                Watched
              </label>
              <input
                type="checkbox"
                id={`s${seasonQuery.data.season}-e${episode.episode}-watched`}
                name={`s${seasonQuery.data.season}-e${episode.episode}-watched`}
                checked={episode.watched}
                onChange={() => onEpisodeWatchedClick(episode)}
              />

              <pre>{JSON.stringify(episode, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
