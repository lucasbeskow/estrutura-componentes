import js from '@eslint/js';
import stencil from '@stencil/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importHelpers from 'eslint-plugin-import-helpers';
import jsxA11y from 'eslint-plugin-jsx-a11y';
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
      'jsx-a11y': jsxA11y,
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

      // Acessibilidade. Cobrem as falhas levantadas na auditoria WCAG: acionador
      // sem foco de teclado, tabindex positivo, aria invalido e alternativa
      // textual ausente. Ver AUDITORIA_A11Y_WCAG_AAA.md.
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': ['error', { aspects: ['invalidHref', 'preferButton'] }],
      'jsx-a11y/aria-props': 'error',
      // Desligada: a regra espera booleanos do React, enquanto Stencil escreve
      // atributos do DOM, onde aria-expanded e afins sao as strings "true" e
      // "false". Todo `aria-*={`${valor}`}` do projeto vira falso positivo.
      'jsx-a11y/aria-proptypes': 'off',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-noninteractive-tabindex': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',

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

  {
    // Componentes reutilizaveis fora do shell nao podem depender do pacote
    // `app`. O contrato entre eles vive em src/global e nos nomes de evento
    // do DOM, nunca em um import relativo para dentro de components/app.
    files: ['src/components/**/*.ts', 'src/components/**/*.tsx'],
    ignores: ['src/components/app/**'],

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../app/**', '../../app/**', '../../../app/**'],
        },
      ],
    },
  },
];
