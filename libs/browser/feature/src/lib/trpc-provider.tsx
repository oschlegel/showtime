'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { FC, PropsWithChildren, useState } from 'react';
import { userSessionService } from './services/user-session-service';
import { trpc } from './trpc';

export const TrpcProvider: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [client] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:4000/api',
          headers() {
            const userSession = userSessionService.getUserSession();
            if (!userSession) {
              return {};
            }
            return {
              authorization: userSession.token,
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
