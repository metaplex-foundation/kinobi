module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
  },
  ignorePatterns: ['dist/**', 'test**', 'package/**'],
};
