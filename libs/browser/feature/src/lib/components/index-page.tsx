'use client';
import { Button } from '@showtime/browser-ui';
import { spacings } from '@showtime/browser-ui/variables/spacings.stylex';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { userSessionService } from '../services/user-session-service';
import { trpc } from '../trpc';
import { ApplicationHeader } from './application-header';

const styles = stylex.create({
  searchButton: {
    marginLeft: spacings.xlarge,
  },
});

export const IndexPage: FC = () => {
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState('');
  const favouritesQuery = trpc.title.getFavourites.useQuery();
  const searchQuery = trpc.title.search.useQuery(searchInput, {
    enabled: searchInput.length > 0,
  });
  const markAsFavouriteMutation = trpc.title.markAsFavourite.useMutation();
  const unmarkAsFavouriteMutation = trpc.title.unmarkAsFavourite.useMutation();

  const showFavourites = useMemo(
    () =>
      !searchQuery.data &&
      favouritesQuery.data &&
      favouritesQuery.data.length > 0,
    [searchQuery.data, favouritesQuery.data]
  );

  useEffect(() => {
    const userSession = userSessionService.getUserSession();
    if (!userSession) {
      push('/login');
      return;
    }
  });

  const onSendClick = () => {
    setSearchInput(inputRef.current?.value ?? '');
  };

  const onTitleClick = (id: string) => {
    push(`/titles/${id}`);
  };

  const onFavouriteClick = (id: string, favourite: boolean) => {
    const mutation = favourite
      ? unmarkAsFavouriteMutation
      : markAsFavouriteMutation;
    const query = showFavourites ? favouritesQuery : searchQuery;
    mutation.mutate(id, {
      onSuccess: () => {
        query.refetch();
      },
    });
  };

  return (
    <div>
      <ApplicationHeader />
      <h1>Titles</h1>
      <input ref={inputRef} />
      <Button sx={styles.searchButton} onClick={onSendClick}>
        Send
      </Button>

      <div>
        {showFavourites && (
          <ul>
            {favouritesQuery.data?.map((title) => (
              <li key={title.id}>
                <pre onClick={() => onTitleClick(title.id)}>
                  {JSON.stringify(title, null, 2)}
                </pre>
                <label htmlFor={`${title.id}-favourite`}>Favourite</label>
                <input
                  type="checkbox"
                  id={`${title.id}-favourite`}
                  name={`${title.id}-favourite`}
                  checked={title.favourite}
                  onChange={() => onFavouriteClick(title.id, title.favourite)}
                />
              </li>
            ))}
          </ul>
        )}
        {searchQuery.data && (
          <ul>
            {searchQuery.data.items.map((title) => (
              <li key={title.id}>
                <pre onClick={() => onTitleClick(title.id)}>
                  {JSON.stringify(title, null, 2)}
                </pre>
                <label htmlFor={`${title.id}-favourite`}>Favourite</label>
                <input
                  type="checkbox"
                  id={`${title.id}-favourite`}
                  name={`${title.id}-favourite`}
                  checked={title.favourite}
                  onChange={() => onFavouriteClick(title.id, title.favourite)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
