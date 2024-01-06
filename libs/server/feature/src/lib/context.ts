import { databaseService } from '@showtime/server-adapter-database';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export async function createContext({ req }: CreateExpressContextOptions) {
  const authorizationHeader = req.headers.authorization;
  const userSession = authorizationHeader
    ? await databaseService.getUserSessionByToken(authorizationHeader)
    : null;
  const user = userSession
    ? await databaseService.getUserById(userSession.userId)
    : null;

  return {
    user,
    userSession,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
