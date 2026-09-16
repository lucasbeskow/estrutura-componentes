import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'estrutura-componentes',
  globalStyle: 'src/styles/global.css',
  taskQueue: 'async',// 'congestionAsync',
  plugins: [
    sass(),
  ],
  devServer: {
    reloadStrategy: 'pageReload',
    port: 3333,
  },
  testing: {
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    // "/node_modules/" e o padrao do Jest e precisa ser repetido: informar a
    // lista sobrescreve o padrao, e instrumentar node_modules quebra a
    // cobertura ao tentar parsear o bundle de testes do proprio Stencil.
    coveragePathIgnorePatterns: ["/node_modules/", ".mock.ts", ".helper.ts"]
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'assets/', warn: true }
      ]
    },
    {
      type: 'docs-readme',
      footer: 'Esta documentação é gerada automáticamente pelo StencilJS =)',
    },
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: 'componentes.html', dest: 'componentes.html' }
      ]
    }
  ],
  preamble: '(C) Betha Sistemas - Plataforma | http://plataforma.betha.cloud - MIT License',
};
