// eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  {
    ...expoConfig,
    ignores: ['dist', 'node_modules', 'build'],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'warn',
    },
  },
]);
