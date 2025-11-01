import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load plugins (CommonJS) via require to ensure compatibility
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooks = require('eslint-plugin-react-hooks');
let reactRefresh = null;
try {
  reactRefresh = require('eslint-plugin-react-refresh');
} catch (e) {
  // optional
}

export default [
  { ignores: ['**/node_modules/**', 'dist/**', 'build/**'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
    },
    settings: { react: { version: 'detect' } },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    rules: {
      // relax rules temporarily to focus on functional fixes
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint.no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-refresh/only-export-components': 'off',

      // keep hooks checks enabled
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load plugins (CommonJS) via require to ensure compatibility
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooks = require('eslint-plugin-react-hooks');
let reactRefresh = null;
try {
  reactRefresh = require('eslint-plugin-react-refresh');
} catch (e) {
  // optional plugin
}

export default [
  { ignores: ['**/node_modules/**', 'dist/**', 'build/**'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
    },
    settings: { react: { version: 'detect' } },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    rules: {
      // relax rules temporarily to focus on functional fixes
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-refresh/only-export-components': 'off',

      // keep hooks checks enabled
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load plugins (CommonJS) via require to ensure compatibility
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRefresh = (() => {
  try {
    return require('eslint-plugin-react-refresh');
  } catch (e) {
    return null;
  }
})();

export default [
  // ignore node_modules and built assets
  { ignores: ['**/node_modules/**', 'dist/**', 'build/**'] },

  // main config for JS/TS/React files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
    },
    settings: { react: { version: 'detect' } },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    rules: {
      // relax rules temporarily to focus on functional fixes
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-refresh/only-export-components': 'off',

      // keep hooks checks enabled
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
// Finalized flat config: single export
export default [
  // ignore node_modules and build directories
  { ignores: ['**/node_modules/**', 'dist/**', 'build/**'] },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
    },
    settings: { react: { version: 'detect' } },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-refresh/only-export-components': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
