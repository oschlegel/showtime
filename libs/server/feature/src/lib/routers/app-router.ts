import { titleRouter } from './title-router';
import { router } from '../trpc';
import { userRouter } from './user-router';

export const appRouter = router({
  title: titleRouter,
  user: userRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
