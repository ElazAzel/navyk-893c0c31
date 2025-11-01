import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load CommonJS plugins via require for compatibility in ESM
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooks = require('eslint-plugin-react-hooks');
let reactRefresh = null;
try {
  reactRefresh = require('eslint-plugin-react-refresh');
} catch (e) {
  // optional
}

export default [
  { ignores: ['**/node_modules/**', 'dist/**', 'build/**', 'public/**'] },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.eslint.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
    },
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-refresh/only-export-components': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // basic hygiene
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'eqeqeq': ['warn', 'smart'],
    },
  },
];
          ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
