const tsPluginModule = await import('@typescript-eslint/eslint-plugin');
const tsPlugin = tsPluginModule.default || tsPluginModule;
const reactHooksModule = await import('eslint-plugin-react-hooks');
const reactHooks = reactHooksModule.default || reactHooksModule;
const parserModule = await import('@typescript-eslint/parser');
const tsParser = parserModule.default || parserModule;
let reactRefresh = null;
try {
  const rr = await import('eslint-plugin-react-refresh');
  reactRefresh = rr.default || rr;
} catch (e) {
  // optional
}

export default [
  // ignore large or non-source directories and common config files that should not be type-checked
  { ignores: ['**/node_modules/**', 'dist/**', 'build/**', 'public/**', '**/*.config.*', '**/*.cjs', '**/*.mjs', '*.js'] },

  // TypeScript/TSX files: enable the TypeScript parser with project-based type information
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // provide project as an array and set tsconfigRootDir so parser can resolve files
        // point to a lint-specific tsconfig that includes `src` and supabase functions
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: process.cwd(),
      },
      // common globals to avoid no-undef for browser/server/deno APIs used in the repo
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        confirm: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        crypto: 'readonly',
        Deno: 'readonly',
        React: 'readonly'
      }
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

      // a few basic checks similar to recommended presets
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'eqeqeq': ['warn', 'smart'],
    },
  },

  // JS/JSX files: don't use the TypeScript project-based parser to avoid "file not found in project" errors
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
