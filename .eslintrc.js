module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    semi: ['error', 'always'],
    '@typescript-eslint/semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-else-return': 'error',
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
  },
};
