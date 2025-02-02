import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';
import type { StyleXStylesWithout } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { spacings } from '../variables/spacings.stylex';
import { colors } from '../variables/colors.stylex';

const styles = stylex.create({
  base: {
    borderRadius: '4px',
    cursor: 'pointer',
    filter: {
      default: 'none',
      ':active': 'brightness(0.8)',
      ':hover': 'brightness(0.8)',
    },
    padding: `${spacings.small} ${spacings.medium}`,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.backgroundBase,
  },
  secondary: {
    backgroundColor: colors.backgroundBase,
    borderColor: colors.primary,
    color: colors.primary,
  },
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  sx?: StyleXStylesWithout<{
    backgroundColor: unknown;
    borderColor: unknown;
    borderRadius: unknown;
    color: unknown;
    cursor: unknown;
    filter: unknown;
    padding: unknown;
  }>;
  variant?: 'primary' | 'secondary';
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  sx,
  variant = 'primary',
  children,
  ...restProps
}) => {
  return (
    <button
      {...stylex.props(
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        sx
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};
