# Importando ES Modules

Os componentes são distribuídos exclusivamente como **ES Modules**, carregados através do
atributo [`type="module"`](https://developer.mozilla.org/docs/Web/HTML/Element/script#module).

```html
<script type="module" src="estrutura-componentes.esm.js"></script>
```

O StencilJS divide o _bundle_ em vários arquivos e carrega sob demanda apenas os componentes
efetivamente usados na página, através de _dynamic imports_.

## Navegadores suportados

São suportados os navegadores que implementam ES Modules e Custom Elements nativamente,
o que abrange todas as versões atuais de Chrome, Edge, Firefox e Safari.

O Internet Explorer 11 **não é suportado**. Até a versão `1.x` desta biblioteca era publicado
um _bundle_ adicional em ES5, carregado via atributo `nomodule`, para atender navegadores
legados. Esse _bundle_ foi descontinuado: o Internet Explorer saiu de suporte em junho de 2022
e o StencilJS removeu a geração de código ES5.

Mais informações em:

- [Output Targets - Differential Bundling](https://stenciljs.com/docs/output-targets#differential-bundling)
- [Browser Support](https://stenciljs.com/docs/browser-support)
