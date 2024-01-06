import { isAfter } from 'date-fns';
import { UserSession } from '../models/user-session';

const userSessionStorageKey = 'showtime.userSession';

const storeUserSession = (userSession: UserSession | undefined) => {
  localStorage.setItem(userSessionStorageKey, JSON.stringify(userSession));
};

const clearUserSession = () => {
  localStorage.removeItem(userSessionStorageKey);
};

const getUserSession = (): UserSession | undefined => {
  const userSessionRaw = localStorage.getItem(userSessionStorageKey);
  const userSession: UserSession =
    userSessionRaw !== null ? JSON.parse(userSessionRaw) : null;

  if (
    userSession !== null &&
    isAfter(new Date(), new Date(userSession.expiresAt))
  ) {
    localStorage.removeItem(userSessionStorageKey);
    return undefined;
  }
  return userSession;
};

export const userSessionService = {
  getUserSession,
  storeUserSession,
  clearUserSession,
};
