# @betha-plataforma/estrutura-componentes

Coleção de Web Components para compor a estrutura de uma aplicação front-end da Betha Sistemas.

Compatível com qualquer stack front-end que utilize HTML, CSS e JavaScript.

## Componentes 📦

### Estrutura

- [bth-app](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/app)
- [bth-menu-ferramenta](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/app/menu-ferramenta/)
- [bth-menu-ferramenta-icone](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/app/menu-ferramenta-icone)
- [bth-menu-painel-lateral](https://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/app/menu-painel-lateral)

### Marca e produto

- [bth-marca-produto](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/marca-produto)

### Ferramentas

- [bth-conta-usuario](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/conta-usuario)
- [bth-notificacoes](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/notificacoes)
- [bth-novidades](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/novidades)
- [bth-ajuda](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/ajuda)
- [bth-utilitarios](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/utilitarios)
- [bth-pesquisa](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/pesquisa)
- [bth-suporte](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components/suporte)

## Instalando

### NPM

```
npm install @betha-plataforma/estrutura-componentes
```

### Yarn

```
yarn add @betha-plataforma/estrutura-componentes
```

### CDN (unpkg)

```html
<script type="module" src="https://unpkg.com/@betha-plataforma/estrutura-componentes/dist/estrutura-componentes/estrutura-componentes.esm.js"></script>

<!-- ... ou registrando os componentes manualmente -->
<script type="module">
  import { defineCustomElements } from 'https://unpkg.com/@betha-plataforma/estrutura-componentes/loader/index.es2017.js';
  defineCustomElements();
</script>
```

## Como usar 🔨

### Fonte

Deve conter a fonte [**Open Sans**](https://fonts.google.com/specimen/Open+Sans?selection.family=Open+Sans) instalada. 

- O [**@betha-plataforma/theme-bootstrap4**](https://github.com/betha-plataforma/theme-bootstrap4) já possui essa fonte e suas variações.

Caso não utilize o framework acima, é possível obter as definições nos arquivos de distribuição ao instalar este projeto. 

```html
<link rel="stylesheet" href="https://unpkg.com/@betha-plataforma/estrutura-componentes/dist/collection/assets/fonts.css">
```

### Ícones

Deve conter a fonte [**Material Design Icons**](http://materialdesignicons.com/) instalada

- A versão suportada é a [**7.4.47**](https://github.com/Templarian/MaterialDesign)
- [Neste link](https://pictogrammers.com/library/mdi/) está a tabela de referência de ícones disponíveis

```html
<link rel="stylesheet" href="https://unpkg.com/@mdi/font@7.4.47/css/materialdesignicons.min.css">
```

*Essa biblioteca de ícones pode ser instalada através de um gerenciador de pacotes `npm install @mdi/font@7.4.47`*

### Estilos

Os estilos globais da biblioteca devem ser importados

```html
<link rel="stylesheet" href="https://unpkg.com/@betha-plataforma/estrutura-componentes/dist/estrutura-componentes/estrutura-componentes.css">
```

### Registrando componentes

*A integração com frameworks frontend, pode exigir algumas configurações específicas.*

Abaixo alguns exemplos de como registrar e utilizar os web components

- [Vanilla JavaScript](http://github.com/betha-plataforma/estrutura-componentes/tree/master/docs/registrando-vanilla.md)
- [Angular](http://github.com/betha-plataforma/estrutura-componentes/tree/master/docs/registrando-angular.md)
- [Vue](http://github.com/betha-plataforma/estrutura-componentes/tree/master/docs/registrando-vue.md)
- [React](http://github.com/betha-plataforma/estrutura-componentes/tree/master/docs/registrando-react.md)

Mais informações sobre [integração com frameworks](https://stenciljs.com/docs/overview) podem ser vistas na documentação oficial do StencilJS

### Configurando componentes

A comunicação com os componentes é feita através de propriedades, atributos, métodos e eventos do DOM, e cada componente tem suas específicações documentadas individualmente, siga o [índice no topo deste documento](#componentes-) ou [navegue através dos diretórios para consultar](http://github.com/betha-plataforma/estrutura-componentes/tree/master/src/components).

## Exemplos

Exemplos podem ser encontrados em [betha-plataforma/exemplos](https://github.com/betha-plataforma/exemplos)

## Compatibilidade 📜

Os componentes são distribuídos exclusivamente como **ES Modules** e exigem navegadores com suporte nativo a Custom Elements, o que abrange as versões atuais de Chrome, Edge, Firefox e Safari.

O **Internet Explorer 11 não é suportado**. Versões anteriores desta biblioteca publicavam um _bundle_ adicional em ES5, carregado através do atributo `nomodule`. Esse _bundle_ deixou de existir: o Internet Explorer saiu de suporte em junho de 2022 e o StencilJS removeu a geração de código ES5.

- [Entender o `type="module"` dos arquivos JavaScript](http://github.com/betha-plataforma/estrutura-componentes/tree/master/docs/importando-esmodules.md)
- [Tabela de suporte entre navegadores do StencilJS](https://stenciljs.com/docs/browser-support)

## Acessibilidade ♿

Os componentes seguem **WCAG 2.2 níveis A e AA**. O nível AAA é atendido em parte: operação por teclado, movimento reduzido, localização e finalidade de link estão cobertos; contraste ampliado está quase completo. O que falta, e o porquê, está em [AUDITORIA_A11Y_WCAG_AAA.md](http://github.com/betha-plataforma/estrutura-componentes/tree/master/AUDITORIA_A11Y_WCAG_AAA.md).

O que a biblioteca garante:

- **Teclado**: todo controle é focável e operável por <kbd>Enter</kbd> e <kbd>Espaço</kbd>, sem depender do mouse. <kbd>Esc</kbd> fecha painéis laterais e o menu de produtos. Nos cartões de notificação e de novidade, o clique no corpo é atalho de mouse: toda ação também está em um controle focável dentro do cartão.
- **Contraste**: todo texto e todo componente de interface cumprem o mínimo de AA (4,5:1 e 3:1). Badges, iniciais de avatar e texto de link chegam a 7:1, o exigido por AAA. Quatro pares ainda ficam entre 4,5:1 e 7:1 — texto e item ativo do menu vertical, banner de erro e textos secundários — porque escurecê-los altera o visual do menu.
- **Foco visível**: contorno sólido de 2px em `:focus-visible`, com cor adequada ao fundo claro ou escuro.
- **Movimento**: animações e transições respeitam `prefers-reduced-motion: reduce`.
- **Leitor de tela**: papéis e estados ARIA coerentes, item de menu atual com `aria-current="page"`, ícones decorativos fora da árvore de acessibilidade.

O que fica a cargo da aplicação hospedeira:

- `lang` e `dir` no `<html>`, e um `<title>` descritivo por página.
- A hierarquia de títulos do documento. Os componentes usam `h3` a `h5` internamente, sem saber em que nível foram montados.
- O conteúdo passado por _slot_: rótulos, textos alternativos e a ordem de leitura dentro dele.
- Um link para pular a navegação, já que a estrutura de menus vem antes do conteúdo.

### Mudanças da versão 2.0.0

Se você estilizava ou consultava o interior dos componentes, três pontos mudaram:

- **`bth-icone` agora é decorativo por padrão.** Sem `aria-label` explícito, o ícone recebe `aria-hidden="true"` e fica fora da árvore de acessibilidade. Antes o rótulo era derivado do nome do ícone, o que fazia leitores de tela anunciarem termos técnicos em inglês. Informe `aria-label` apenas quando o ícone carregar informação que não está no texto ao redor.
- **Acionadores que não navegam viraram `<button>`.** Itens de menu, filtros e alternadores eram `<a href="">`. Tags, propriedades e nomes de evento não mudaram, mas seletores CSS e consultas ao _shadow DOM_ que buscavam `a` precisam buscar `button`.
- **Novos tokens de cor.** Foram criados `--bth-app-red-dark-20`, `--bth-app-green-dark-20` e `--bth-app-blue-dark-20`, além de `--bth-app-<cor>-dark-40` para as sete cores de avatar. Nenhum token existente mudou de valor.

### Verificando

```bash
yarn lint      # eslint-plugin-jsx-a11y
yarn test.a11y # axe-core sobre os componentes
```

A varredura com `axe` cobre o que é verificável por máquina. Os critérios que dependem de julgamento humano são revisados na auditoria.

## Dúvidas

Possíveis dúvidas foram esclarecidas [nesta documentação](http://github.com/betha-plataforma/estrutura-componentes/tree/master/docs/FAQ.md)

## Contribuindo 👥

Contribua para a evolução dos componentes [Como contribuir](http://github.com/betha-plataforma/estrutura-componentes/tree/master/CONTRIBUTING.md).
