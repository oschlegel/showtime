'use client';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { trpc } from '../trpc';
import { ApplicationHeader } from './application-header';

export const RegisterPage: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>();
  const { push } = useRouter();
  const registerMutation = trpc.user.register.useMutation();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        push('/login');
      },
    });
  };

  return (
    <div>
      <ApplicationHeader />
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" {...register('firstName', { required: true })} />

        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" {...register('lastName', { required: true })} />

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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            required: true,
            validate: (value) => value === watch('password'),
          })}
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
        {!!registerMutation.error && (
          <span>{JSON.stringify(registerMutation.error)}</span>
        )}
        <input type="submit" disabled={registerMutation.isLoading} />
      </form>
    </div>
  );
};

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
