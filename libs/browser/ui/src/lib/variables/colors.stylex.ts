import * as stylex from '@stylexjs/stylex';

// A constant can be used to avoid repeating the media query
const DARK = '@media (prefers-color-scheme: dark)';

export const colors = stylex.defineVars({
  primary: { default: '#73E1A6', [DARK]: 'lightblue' },
  backgroundBase: { default: 'white', [DARK]: 'black' },
  backgroundSurface: { default: '#eeeff2', [DARK]: '#212225' },
});
