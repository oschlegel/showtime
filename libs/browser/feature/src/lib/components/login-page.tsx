'use client';
import { Button, Input, display, margin } from '@showtime/browser-ui';
import { colors } from '@showtime/browser-ui/variables/colors.stylex';
import { spacings } from '@showtime/browser-ui/variables/spacings.stylex';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { userSessionService } from '../services/user-session-service';
import { trpc } from '../trpc';
import { ApplicationHeader } from './application-header';

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    padding: spacings.large,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: spacings.xxxlarge,
    backgroundColor: colors.backgroundSurface,
    borderRadius: '4px',
  },
});

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
      <form {...stylex.props(styles.form)} onSubmit={handleSubmit(onSubmit)}>
        <h1>Login Page</h1>

        <label htmlFor="email" {...stylex.props(margin.tLarge)}>
          Email
        </label>
        <Input
          id="email"
          type="email"
          sx={display.block}
          {...register('email', { required: true })}
        />

        <label htmlFor="password" {...stylex.props(margin.tMedium)}>
          Password
        </label>
        <Input
          id="password"
          type="password"
          sx={display.block}
          {...register('password', { required: true })}
        />

        {Object.keys(errors).length > 0 && (
          <span {...stylex.props(margin.tMedium)}>
            {JSON.stringify(
              Object.entries(errors).reduce(
                (result, [key, value]) => ({ ...result, [key]: value.message }),
                {}
              )
            )}
          </span>
        )}
        {!!loginMutation.error && (
          <span {...stylex.props(margin.tMedium)}>
            {JSON.stringify(loginMutation.error)}
          </span>
        )}
        <Button
          type="submit"
          sx={margin.tLarge}
          disabled={loginMutation.isLoading}
        >
          Senden
        </Button>
        <Button
          type="button"
          variant="secondary"
          sx={margin.tMedium}
          onClick={onRegister}
        >
          Register
        </Button>
      </form>
    </div>
  );
};

type FormFields = {
  email: string;
  password: string;
};
