import type { AppRouter } from '@showtime/server-feature';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
