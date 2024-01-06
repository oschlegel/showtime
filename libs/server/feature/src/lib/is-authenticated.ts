import { TRPCError } from '@trpc/server';
import { t } from './trpc';
import { userService } from './services/user-service';

export const isAuthenticated = t.middleware((opts) => {
  const { ctx, next } = opts;
  if (!ctx.userSession || userService.isUserSessionExpired(ctx.userSession)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }
  return next(opts);
});
