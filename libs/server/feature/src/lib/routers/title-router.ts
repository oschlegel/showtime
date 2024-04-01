import { z } from 'zod';
import { GetSeasonDtoZod } from '../dto/get-season-dto';
import { SeasonDtoZod } from '../dto/season-dto';
import { TitleDtoZod } from '../dto/title-dto';
import { TitleSearchResultDtoZod } from '../dto/title-search-result-dto';
import { isAuthenticated } from '../is-authenticated';
import { titleService } from '../services/title-service';
import { t } from '../trpc';

export const titleRouter = t.router({
  getFavourites: t.procedure
    .use(isAuthenticated)
    .output(z.array(TitleDtoZod))
    .query(async (opts) => {
      const {
        ctx: { user },
      } = opts;
      console.log('titleRouter.getFavourites');

      return titleService.getFavourites(user!.id);
    }),

  getTitle: t.procedure
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

  getSeason: t.procedure
    .use(isAuthenticated)
    .input(GetSeasonDtoZod)
    .output(SeasonDtoZod)
    .query(async (opts) => {
      const {
        ctx: { user },
        input,
      } = opts;
      console.log('titleRouter.getSeasons', JSON.stringify(input));

      return titleService.getSeason(input.id, input.seasonId, user!.id);
    }),

  markAsFavourite: t.procedure
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

  unmarkAsFavourite: t.procedure
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

  markAsWatched: t.procedure
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

  unmarkAsWatched: t.procedure
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

  search: t.procedure
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
