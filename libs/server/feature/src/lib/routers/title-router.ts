import { z } from 'zod';
import { titleService } from '../services/title-service';
import { publicProcedure, router } from '../trpc';
import { isAuthenticated } from '../is-authenticated';
import { TitleSearchResultDtoZod } from '../dto/title-search-result-dto';
import { TitleDtoZod } from '../dto/title-dto';
import { GetSeasonsDtoZod } from '../dto/get-seasons-dto';
import { SeasonDtoZod } from '../dto/season-dto';

export const titleRouter = router({
  getFavourites: publicProcedure
    .use(isAuthenticated)
    .output(z.array(TitleDtoZod))
    .query(async (opts) => {
      const {
        ctx: { user },
      } = opts;
      console.log('titleRouter.getFavourites');

      return titleService.getFavourites(user!.id);
    }),

  getTitle: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .output(TitleDtoZod)
    .query(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.getTitle', JSON.stringify(input));

      return titleService.getTitle(input, user!.id);
    }),

  getSeasons: publicProcedure
    .use(isAuthenticated)
    .input(GetSeasonsDtoZod)
    .output(z.array(SeasonDtoZod))
    .query(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.getSeasons', JSON.stringify(input));

      return titleService.getSeasons(input.id, input.seasonIds, user!.id);
    }),

  markAsFavourite: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.markAsFavourite', JSON.stringify(input));

      return titleService.markAsFavourite(input, user!.id);
    }),

  unmarkAsFavourite: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.unmarkAsFavourite', JSON.stringify(input));

      return titleService.unmarkAsFavourite(input, user!.id);
    }),

  markAsWatched: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.markAsWatched', JSON.stringify(input));

      return titleService.markAsWatched(input, user!.id);
    }),

  unmarkAsWatched: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.unmarkAsWatched', JSON.stringify(input));

      return titleService.unmarkAsWatched(input, user!.id);
    }),

  search: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .output(TitleSearchResultDtoZod)
    .query(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.searchTitle', JSON.stringify(input));

      return titleService.search(input, user!.id);
    }),
});
