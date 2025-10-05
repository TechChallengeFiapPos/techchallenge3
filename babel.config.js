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
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
