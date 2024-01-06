import {
  UserSession,
  databaseService,
} from '@showtime/server-adapter-database';
import { RegisterUserDto } from '../dto/register-user-dto';
import { UserDto } from '../dto/user-dto';
import { MD5, SHA256 } from 'crypto-js';
import { LoginUserDto } from '../dto/login-user-dto';
import { UserSessionDto } from '../dto/user-session-dto';
import { TRPCError } from '@trpc/server';
import { add, isAfter } from 'date-fns';

const userPasswordSalt = process.env.USER_PASSWORD_SALT;

if (!userPasswordSalt) {
  throw new Error('USER_PASSWORD_SALT is not defined');
}

const isUserSessionExpired = (userSession: UserSession): boolean => {
  return isAfter(new Date(), add(userSession.createdAt, { days: 2 }));
};

const login = async (options: LoginUserDto): Promise<UserSessionDto> => {
  const user = await databaseService.getUserByEmail(options.email);
  const password = encryptPassword(options.password);

  if (!user || user.password !== password) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bad credentials' });
  }

  const userSession = await databaseService.createUserSession({
    userId: user.id,
    token: MD5(Math.random().toString()).toString(),
  });
  const expiresAt = add(userSession.createdAt, { days: 2 });

  return {
    expiresAt,
    token: userSession.token,
  };
};

const logout = async (userSession: UserSession): Promise<void> => {
  await databaseService.deleteUserSession(userSession.id);
};

const register = async (options: RegisterUserDto): Promise<UserDto> => {
  const user = await databaseService.createUser({
    ...options,
    password: encryptPassword(options.password),
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

const encryptPassword = (password: string): string => {
  return SHA256(MD5(password + userPasswordSalt)).toString();
};

export const userService = { isUserSessionExpired, login, logout, register };
