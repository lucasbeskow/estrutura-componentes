import js from '@eslint/js';
import stencil from '@stencil/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importHelpers from 'eslint-plugin-import-helpers';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/',
      'loader/',
      'www/',
      'coverage/',
      '.stencil/',
      'src/components.d.ts',
    ],
  },

  js.configs.recommended,
  tsPlugin.configs['flat/eslint-recommended'],
  stencil.configs.flat.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      'import-helpers': importHelpers,
    },

    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'linebreak-style': ['error', 'unix'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'no-unused-vars': ['off'],

      'stencil/async-methods': 'error',
      'stencil/ban-prefix': ['error', ['stencil', 'stnl', 'st']],
      'stencil/decorators-context': 'error',
      'stencil/decorators-style': [
        'error',
        {
          prop: 'inline',
          state: 'inline',
          element: 'inline',
          event: 'inline',
          method: 'multiline',
          watch: 'multiline',
          listen: 'multiline',
        },
      ],
      'stencil/element-type': 'error',
      'stencil/host-data-deprecated': 'error',
      'stencil/methods-must-be-public': 'error',
      'stencil/no-unused-watch': 'error',
      'stencil/own-methods-must-be-private': 'error',
      'stencil/own-props-must-be-private': 'error',
      'stencil/prefer-vdom-listener': 'off',
      'stencil/props-must-be-public': 'error',
      'stencil/props-must-be-readonly': 'error',
      'stencil/render-returns-host': 'error',
      'stencil/required-jsdoc': 'error',
      'stencil/single-export': 'error',
      'stencil/strict-mutable': 'error',

      // Regras introduzidas pelo @stencil/eslint-plugin 1.x. Apontam problemas
      // reais e pre-existentes, mas corrigi-los altera a API publica dos
      // componentes. Ficam como aviso ate serem tratados separadamente.
      'stencil/ban-exported-const-enums': 'warn',
      'stencil/reserved-member-names': 'warn',

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: ['module', '/^@shared/', ['parent', 'sibling', 'index']],
          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],
    },
  },
];
