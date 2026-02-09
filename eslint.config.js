import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from "eslint-plugin-simple-import-sort";
// 1. Importe o config do prettier
import eslintPluginPrettier from "eslint-plugin-prettier"
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(['dist']),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "prettier": eslintPluginPrettier,
    },
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Grupos de imports. A ordem aqui define a ordem no arquivo.

            // 1. Imports do React e pacotes relacionados primeiro
            ["^react", "^@react"],

            // 2. Pacotes externos (ex: 'axios', 'lodash', bibliotecas de terceiros)
            ["^@?\\w"],

            // 3. Imports absolutos internos (se você usa path aliases como @/components)
            ["^@/"],

            // 4. Imports relativos (começando com ./ ou ../)
            ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

            // 5. Imports de estilos (css, scss, etc) ficam por último
            ["^.+\\.?(css|less|scss|sass|styl)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      '@typescript-eslint/naming-convention': [
        'warn',
        // Regra 1: Interfaces devem começar com I (Ex: IUser)
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true,
          },
        },
        // Regra 2: Types (Type Aliases) devem começar com T (Ex: TUser)
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          custom: {
            regex: '^T[A-Z]',
            match: true,
          },
        },
      ],
      "prettier/prettier": "warn",
    },
  },
  eslintConfigPrettier,
])
