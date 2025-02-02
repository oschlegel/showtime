const path = require('path');
module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev: process.env.NODE_ENV === 'development',
        genConditionalClasses: true,
        treeshakeCompensation: true,
        aliases: {
          '@showtime/browser-ui/*': [
            path.resolve(
              process.env.NX_WORKSPACE_ROOT,
              'libs/browser/ui/src/lib/*'
            ),
          ],
        },
        unstable_moduleResolution: {
          type: 'commonJS',
          rootDir: __dirname,
        },
      },
    ],
  ],
};
