'use client';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { userSessionService } from '../services/user-session-service';
import { trpc } from '../trpc';
import { ApplicationHeader } from './application-header';

export const LoginPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const { push } = useRouter();
  const loginMutation = trpc.user.login.useMutation();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (userSession) => {
        userSessionService.storeUserSession(userSession);
        push('/');
      },
    });
  };

  const onRegister = () => {
    push('/register');
  };

  return (
    <div>
      <ApplicationHeader />
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true })}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: true })}
        />

        {Object.keys(errors).length > 0 && (
          <span>
            {JSON.stringify(
              Object.entries(errors).reduce(
                (result, [key, value]) => ({ ...result, [key]: value.message }),
                {}
              )
            )}
          </span>
        )}
        {!!loginMutation.error && (
          <span>{JSON.stringify(loginMutation.error)}</span>
        )}
        <input type="submit" disabled={loginMutation.isLoading} />
        <button type="button" onClick={onRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

type FormFields = {
  email: string;
  password: string;
};
