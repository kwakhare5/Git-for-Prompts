import path from 'path';
import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setPixelFormat('yuv420p');
Config.setCrf(12);
Config.setAudioBitrate('320k');
Config.setChromiumOpenGlRenderer('angle');
Config.setOverwriteOutput(true);

Config.overrideWebpackConfig((currentConfiguration) => {
  const rulesWithoutCss = (currentConfiguration.module?.rules ?? []).filter((rule: any) => {
    return rule && rule !== '...' && !rule.test?.toString().includes('.css');
  });

  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...rulesWithoutCss,
        {
          test: /\.css$/i,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  auto: true,
                  namedExport: false,
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
  };
});

