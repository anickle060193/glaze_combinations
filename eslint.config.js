import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig( [
  globalIgnores( [ 'dist' ] ),
  {
    files: [ '**/*.{js,jsx,ts,tsx}' ],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactX.configs[ 'strict-type-checked' ],
      reactDom.configs.strict,
      stylistic.configs.customize( {
        severity: 'error',
        indent: 2,
        quotes: 'single',
        semi: true,
        jsx: true,
        arrowParens: true,
        braceStyle: 'allman',
        blockSpacing: true,
        quoteProps: 'as-needed',
        commaDangle: 'always-multiline',
      } ),
    ],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.node.json',
          './tsconfig.app.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    rules: {
      '@stylistic/space-in-parens': [ 'error', 'always' ],
      '@stylistic/arrow-spacing': [ 'error', { before: true, after: true } ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/computed-property-spacing': [ 'error', 'always' ],
      '@stylistic/curly-newline': [ 'error', 'always' ],
      '@stylistic/object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ],
      '@stylistic/object-curly-newline': [ 'error', { multiline: true, consistent: true } ],
      '@stylistic/array-bracket-newline': [ 'error', { multiline: true } ],
      '@stylistic/array-element-newline': [ 'error', 'consistent' ],
      '@stylistic/key-spacing': 'error',
      '@stylistic/keyword-spacing': [
        'error', {
          before: true,
          after: false,
          overrides: {
            import: { before: false, after: true },
            from: { before: true, after: true },
            catch: { before: false, after: false },
            return: { before: false, after: true },
            const: { before: false, after: true },
            let: { before: false, after: true },
            type: { before: false, after: true },
          },
        },
      ],
      '@stylistic/space-before-function-paren': [
        'error', {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
          catch: 'never',
        },
      ],

      '@stylistic/jsx-quotes': [ 'error', 'prefer-double' ],
      '@stylistic/jsx-wrap-multilines': 'error',
      '@stylistic/jsx-one-expression-per-line': 'off',

      '@typescript-eslint/restrict-template-expressions': [
        'error', {
          allowNumber: true,
        },
      ],
    },
  },
] );
