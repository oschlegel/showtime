import { LoginUserDtoZod } from '../dto/login-user-dto';
import { RegisterUserDtoZod } from '../dto/register-user-dto';
import { UserDtoZod } from '../dto/user-dto';
import { UserSessionDtoZod } from '../dto/user-session-dto';
import { isAuthenticated } from '../is-authenticated';
import { userService } from '../services/user-service';
import { t } from '../trpc';

export const userRouter = t.router({
  login: t.procedure
    .input(LoginUserDtoZod)
    .output(UserSessionDtoZod)
    .mutation(async (opts) => {
      const { input } = opts;
      console.log('userRouter.login', JSON.stringify(input));

      return userService.login(input);
    }),

  logout: t.procedure.use(isAuthenticated).mutation(async (opts) => {
    const {
      ctx: { userSession },
    } = opts;
    console.log('userRouter.logout', JSON.stringify(userSession));

    return userService.logout(userSession!);
  }),

  register: t.procedure
    .input(RegisterUserDtoZod)
    .output(UserDtoZod)
    .mutation(async (opts) => {
      const { input } = opts;
      console.log('userRouter.register', JSON.stringify(input));

      return userService.register(input);
    }),
});
