module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@src': './src',
            '@components': './src/components',
            '@config': './src/config',
            '@screens': './src/screens',
            '@services': './src/services',
            '@components': './src/components',
            // adicione mais conforme sua estrutura
          },
        },
      ],
      'react-native-reanimated/plugin', // mantenha se usa reanimated
    ],
  };
};
