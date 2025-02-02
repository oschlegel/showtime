'use client';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { UserSession } from '../models/user-session';
import { userSessionService } from '../services/user-session-service';
import { trpc } from '../trpc';
import { colors } from '@showtime/browser-ui/variables/colors.stylex';

const styles = stylex.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: colors.backgroundSurface,
  },
});

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
    <header {...stylex.props(styles.header)}>
      <Link href="/">Showtime</Link>
      {userSession && <button onClick={onLogout}>Logout</button>}
    </header>
  );
};
