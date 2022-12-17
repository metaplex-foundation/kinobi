module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    indent: 'off',
    '@typescript-eslint/indent': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'operator-linebreak': ['error', 'after'],
  },
  ignorePatterns: ['dist/**'],
};
