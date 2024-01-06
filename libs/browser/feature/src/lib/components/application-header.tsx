'use client';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { userSessionService } from '../services/user-session-service';
import { trpc } from '../trpc';
import Link from 'next/link';
import { UserSession } from '../models/user-session';

export const ApplicationHeader: FC = () => {
  const { push } = useRouter();
  const [userSession, setUserSession] = useState<UserSession>();
  const userLogout = trpc.user.logout.useMutation();

  useEffect(() => {
    setUserSession(userSessionService.getUserSession());
  }, []);

  const onLogout = () => {
    userLogout.mutate(undefined, {
      onSuccess: () => {
        userSessionService.clearUserSession();
        push('/login');
      },
    });
  };

  return (
    <header>
      <Link href="/">Showtime</Link>
      {userSession && <button onClick={onLogout}>Logout</button>}
    </header>
  );
};
