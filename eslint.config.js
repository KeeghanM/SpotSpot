import js from '@eslint/js'
import * as tsParser from '@typescript-eslint/parser'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import solid from 'eslint-plugin-solid/configs/typescript'

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.vscode/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.d.ts',
    ],
  },
  js.configs.recommended, // Base ESLint configuration for JavaScript
  {
    // Use TypeScript parser for JS/TS files
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: 'tsconfig.json' },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        Image: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },
  {
    // Use SolidJS ESLint rules for SolidJS files
    files: ['**/*.{ts,tsx}'],
    plugins: solid.plugins,
    rules: solid.rules,
  },
  // Use Astro ESLint rules for Astro files - spread the entire config
  ...eslintPluginAstro.configs.recommended,
  {
    // Use JSX Accessibility rules for all files
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx,astro}'],
    plugins:
      eslintPluginJsxA11y.flatConfigs.recommended.plugins,
    rules:
      eslintPluginJsxA11y.flatConfigs.recommended.rules,
  },
]
