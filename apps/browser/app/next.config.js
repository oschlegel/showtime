//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
// @ts-expect-error: No type definitions available
const stylexPlugin = require('@stylexjs/nextjs-plugin');
const path = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  stylexPlugin({
    aliases: {
      '@showtime/browser-ui/*': [
        path.resolve(
          process.env.NX_WORKSPACE_ROOT,
          'libs/browser/ui/src/lib/*'
        ),
      ],
    },
    rootDir: __dirname,
  }),
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
