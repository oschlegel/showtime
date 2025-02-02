import { InputHTMLAttributes, FC, PropsWithChildren, forwardRef } from 'react';
import type { StyleXStylesWithout } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { spacings } from '../variables/spacings.stylex';
import { colors } from '../variables/colors.stylex';

const styles = stylex.create({
  input: {
    backgroundColor: colors.backgroundBase,
    borderColor: colors.primary,
    borderRadius: '4px',
    cursor: 'pointer',
    color: colors.primary,
    filter: {
      default: 'none',
      ':active': 'brightness(0.8)',
      ':hover': 'brightness(0.8)',
    },
    padding: `${spacings.small} ${spacings.medium}`,
    width: '100%',
    boxSizing: 'border-box',
  },
});

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sx?: StyleXStylesWithout<{
    backgroundColor: unknown;
    borderColor: unknown;
    borderRadius: unknown;
    color: unknown;
    cursor: unknown;
    filter: unknown;
    padding: unknown;
  }>;
}

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ sx, ...restProps }, ref) => {
    return (
      <input {...stylex.props(styles.input, sx)} {...restProps} ref={ref} />
    );
  }
);
