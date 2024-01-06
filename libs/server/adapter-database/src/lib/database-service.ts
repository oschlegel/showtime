import { and, eq } from 'drizzle-orm';
import { db } from './database-client';
import { NewUser, User, users } from './entities/user';
import {
  NewUserSession,
  UserSession,
  userSessions,
} from './entities/user-session';
import { NewTitle, Title, titles } from './entities/title';
import { Favourite, NewFavourite, favourites } from './entities/favourite';
import { NewWatch, Watch, watches } from './entities/watch';

const createFavourite = async (favourite: NewFavourite): Promise<Favourite> => {
  const entities = await db.insert(favourites).values(favourite).returning();
  return entities[0];
};

const updateFavourite = async (favourite: Favourite): Promise<Favourite> => {
  const entities = await db
    .update(favourites)
    .set(favourite)
    .where(
      and(
        eq(favourites.titleId, favourite.titleId),
        eq(favourites.userId, favourite.userId)
      )
    )
    .returning();
  return entities[0];
};

const deleteFavourite = async (
  titleId: string,
  userId: number
): Promise<Favourite> => {
  const entities = await db
    .delete(favourites)
    .where(and(eq(favourites.titleId, titleId), eq(favourites.userId, userId)))
    .returning();
  return entities[0];
};

const getFavourite = async (
  titleId: string,
  userId: number
): Promise<Favourite | undefined> => {
  return db.query.favourites.findFirst({
    where: and(eq(favourites.titleId, titleId), eq(favourites.userId, userId)),
  });
};

const getFavouritesByUserId = async (userId: number): Promise<Favourite[]> => {
  return db.query.favourites.findMany({
    where: eq(favourites.userId, userId),
  });
};

const createTitle = async (title: NewTitle): Promise<Title> => {
  const entities = await db.insert(titles).values(title).returning();
  return entities[0];
};

const updateTitle = async (title: Title): Promise<Title> => {
  const entities = await db
    .update(titles)
    .set(title)
    .where(eq(titles.id, title.id))
    .returning();
  return entities[0];
};

const deleteTitle = async (id: string): Promise<Title> => {
  const entities = await db.delete(titles).where(eq(titles.id, id)).returning();
  return entities[0];
};

const getTitle = async (id: string): Promise<Title | undefined> => {
  return db.query.titles.findFirst({ where: eq(titles.id, id) });
};

const createUser = async (user: NewUser): Promise<User> => {
  const entities = await db.insert(users).values(user).returning();
  return entities[0];
};

const updateUser = async (user: User): Promise<User> => {
  const entities = await db
    .update(users)
    .set(user)
    .where(eq(users.id, user.id))
    .returning();
  return entities[0];
};

const deleteUser = async (id: number): Promise<User> => {
  const entities = await db.delete(users).where(eq(users.id, id)).returning();
  return entities[0];
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return db.query.users.findFirst({ where: eq(users.email, email) });
};

const getUserById = async (id: number): Promise<User | undefined> => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

const createUserSession = async (
  userSession: NewUserSession
): Promise<UserSession> => {
  const entities = await db
    .insert(userSessions)
    .values(userSession)
    .returning();
  return entities[0];
};

const deleteUserSession = async (id: number): Promise<UserSession> => {
  const entities = await db
    .delete(userSessions)
    .where(eq(userSessions.id, id))
    .returning();
  return entities[0];
};

const getUserSessionByToken = async (
  token: string
): Promise<UserSession | undefined> => {
  return db.query.userSessions.findFirst({
    where: eq(userSessions.token, token),
  });
};

const createWatch = async (watch: NewWatch): Promise<Watch> => {
  const entities = await db.insert(watches).values(watch).returning();
  return entities[0];
};

const updateWatch = async (watch: Watch): Promise<Watch> => {
  const entities = await db
    .update(watches)
    .set(watch)
    .where(
      and(eq(watches.titleId, watch.titleId), eq(watches.userId, watch.userId))
    )
    .returning();
  return entities[0];
};

const deleteWatch = async (titleId: string, userId: number): Promise<Watch> => {
  const entities = await db
    .delete(watches)
    .where(and(eq(watches.titleId, titleId), eq(watches.userId, userId)))
    .returning();
  return entities[0];
};

const getWatch = async (
  titleId: string,
  userId: number
): Promise<Watch | undefined> => {
  return db.query.watches.findFirst({
    where: and(eq(watches.titleId, titleId), eq(watches.userId, userId)),
  });
};

const getWatchesByUserId = async (userId: number): Promise<Watch[]> => {
  return db.query.watches.findMany({
    where: eq(watches.userId, userId),
  });
};

export const databaseService = {
  createFavourite,
  updateFavourite,
  deleteFavourite,
  getFavourite,
  getFavouritesByUserId,
  createTitle,
  updateTitle,
  deleteTitle,
  getTitle,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  createUserSession,
  deleteUserSession,
  getUserSessionByToken,
  createWatch,
  updateWatch,
  deleteWatch,
  getWatch,
  getWatchesByUserId,
};
