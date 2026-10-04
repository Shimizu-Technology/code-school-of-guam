import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import react from 'eslint-plugin-react'
import hooks from 'eslint-plugin-react-hooks'
import a11y from 'eslint-plugin-jsx-a11y'
import next from '@next/eslint-plugin-next'
import globals from 'globals'

export default defineConfig([
  globalIgnores(['.next/**', 'out/**', 'node_modules/**', '.codex/**', 'next-env.d.ts']),
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { '@next/next': fixupPluginRules(next) },
    rules: { ...next.configs.recommended.rules, ...next.configs['core-web-vitals'].rules },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': hooks, 'jsx-a11y': a11y },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      // Preserve the site's hooks gate; React Compiler is not enabled in this app.
      'react-hooks/rules-of-hooks': 'error',
      ...a11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  { files: ['tests/**'], rules: { '@next/next/no-img-element': 'off' } },
  { files: ['**/*.cjs', 'tailwind.config.ts'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
])
