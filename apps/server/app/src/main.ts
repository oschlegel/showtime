/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { appRouter, createContext } from '@showtime/server-feature';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(4000, () => {
  console.log(`[ ready ] http://localhost:4000`);
});
