# Registrando componentes

Os componentes são distribuídos de uma maneira que um único arquivo serve de _entrypoint_ (entrada) para todos os componentes
da coleção do projeto.

Todos os componentes do projeto são agrupados automaticamente no _build_ para compor arquivos separados de componentes que se relacionam, esses arquivos são carregados em _runtime_ otimizando a performance das aplicações. Esse é o mecanismo de [_lazy-loading_ do StencilJS](https://stenciljs.com/blog/how-lazy-loading-web-components-work).

## Estilos

Estilos globais do componente devem ser importados:

- `[LIBS_PROJETO]/@betha-plataforma/estrutura-componentes/dist/estrutura-componentes/estrutura-componentes.css`

Também é distribuído um diretório com as fontes de **Open Sans**, com suas devidas estilizações

- `[LIBS_PROJETO]/@betha-plataforma/estrutura-componentes/dist/collection/assets/fonts.css`

## Vanilla

A maneira mais simples de importar é através das tags `link` e `script` no index.html do projeto.

```html
<header>
  <!-- ... -->
  <link rel="stylesheet" href="[LIBS_PROJETO]/@betha-plataforma/estrutura-componentes/dist/estrutura-componentes/estrutura-componentes.css">

  <!-- Caso não possua as fontes -->
  <link rel="stylesheet" href="[LIBS_PROJETO]/@betha-plataforma/estrutura-componentes/dist/collection/assets/fonts.css">
  <!-- ... -->
</header>

<body>
  <!-- ... -->
  <script type="module" src="[LIBS_PROJETO]/@betha-plataforma/estrutura-componentes/dist/estrutura-componentes/estrutura-componentes.esm.js"></script>
  <!-- ... -->
</body>
```

> ℹ️ [Entender o type="module" dos arquivos JavaScript](./importando-esmodules.md)

[💡 Acesse um projeto de demonstração com AngularJS](../showcase/angularjs)

## Frameworks

A integração com frameworks frontend, podem exigir algumas configurações específicas.

- [Registrando componentes em Angular](./registrando-angular.md)
- [Registrando componentes em React](./registrando-react.md)
- [Registrando componentes em Vue](./registrando-vue.md)

Mais informações sobre [integração com frameworks](https://stenciljs.com/docs/overview) podem ser vistas na documentação oficial do StencilJS

## Notas

⚠️ É importante estar atento em projetos mais antigos, que possuem _task runners_ para construir os arquivos de distribuição. Nestes projetos se faz necessário verificar se todos os módulos do projeto serão copiadas, possibilitando o _lazy-loading_.

_Module bundlers_ modernos, como _webpack_ e _rollup_, já resolvem automaticamente os módulos separados.
