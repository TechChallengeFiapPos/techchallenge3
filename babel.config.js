module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Necessário para react-native-reanimated
      'react-native-reanimated/plugin',

      // (Opcional) Se quiser usar aliases no projeto
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@config': './src/config',
            '@context': './src/context',
            '@services': './src/services',
          },
        },
      ],

      // (Opcional) Se for usar nativewind futuramente
      // 'nativewind/babel',
    ],
  };
};
// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       'react-native-reanimated/plugin', // Necessário p/ usar reanimated
//       [
//         'module-resolver',
//         {
//           root: ['./src'],
//           alias: {
//             '@components': './src/components',
//             '@screens': './src/screens',
//             '@navigation': './src/navigation',
//             '@config': './src/config',
//             '@context': './src/context',
//             '@services': './src/services',
//           },
//         },
//       ],
//     ],
//   };
// };
