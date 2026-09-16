# Auditoria de Acessibilidade — WCAG 2.2 nível AAA

Escopo: os 25 componentes em `src/components/`, os tokens em `src/styles/global.css` e as páginas de demonstração `src/index.html` e `src/componentes.html`.

Método: revisão manual do código-fonte (JSX, SCSS/CSS, HTML) e cálculo programático de razão de contraste sobre os tokens `--bth-app-*` já resolvidos (as cores derivadas por `hsl(from ... calc(l ± n))` foram computadas). Não foi executada ferramenta automatizada — o projeto não possui nenhuma no pipeline (ver item G1).

Os níveis A e AA aparecem no relatório porque nível AAA os pressupõe: uma falha de nível A é também uma falha de AAA.

## Resumo

| Severidade | Quantidade |
|---|---|
| Bloqueante (nível A) | 8 |
| Alta (nível AA) | 4 |
| AAA específico | 10 |
| Processo/ferramental | 2 |

Conclusão: o projeto **não atinge WCAG AAA** e também **não atinge o nível A** no estado atual. Os bloqueadores principais são operação por teclado (controles clicáveis que não recebem foco), o padrão ARIA de menu aplicado sem o comportamento de teclado correspondente, e `tabindex` positivo.

---

## A. Bloqueantes — nível A

### A1. Controles clicáveis sem foco de teclado (2.1.1, 2.1.3)

Elementos não interativos, ou âncoras sem `href`, recebem `onClick` e não entram na ordem de tabulação. A funcionalidade fica inacessível por teclado.

- `src/components/suporte/suporte.tsx:116` e `:139` — `<a>` sem `href` com `onClick`. "Suporte via chat" e "Abrir um chamado" não são focáveis.
- `src/components/marca-produto/marca-produto.tsx:243` — `<section onClick>` abre o dropdown de produtos. O dropdown inteiro só é alcançável por mouse.
- `src/components/notificacoes/notificacao-item/notificacao-item.tsx:214` — `<div onClick>` abre o painel da notificação.
- `src/components/novidades/novidade-item/novidade-item.tsx:74` — `<div onClick>` abre os detalhes da novidade.
- `src/components/comuns/selecao-contexto/selecao-contexto.tsx:238` — `<li onClick>`; a seleção depende do clique borbulhar do `<a>` interno, que por sua vez usa `href=""`.

Correção: usar `<button type="button">` (ou `<a href>` real quando houver navegação). Nenhum `onKeyDown` supletivo existe no repositório.

### A2. `role="button"` em âncora sem tratamento de Espaço (2.1.1)

- `src/components/app/app.tsx:602` — alternar menu lateral.
- `src/components/app/app.tsx:680` — alternar painel de ferramentas no mobile.

Âncora dispara `click` com Enter, mas não com Espaço; `role="button"` promete os dois. Correção: trocar por `<button>`.

### A3. `tabindex` positivo quebra a ordem de foco (2.4.3)

- `src/components/comuns/selecao-contexto/selecao-contexto.tsx:215` — `tabindex="1"` no campo de busca.
- `src/components/comuns/selecao-contexto/selecao-contexto.tsx:238` — `tabindex={index + 1}` em cada item da lista.

Valores positivos deslocam esses elementos para a frente de toda a página hospedeira. Com N itens, a ordem global do documento é reescrita. Correção: `tabindex="0"` no campo, `tabindex="-1"` nos itens e foco gerenciado (roving tabindex), que já existe parcialmente em `handleArrowUp`/`handleArrowDown` (`:173`).

### A4. Padrão `menubar`/`menuitem` sem semântica nem teclado (1.3.1, 4.1.2)

- `src/components/app/app.tsx:630`, `:655`, `:729` — `role="menubar"`.
- `src/components/app/app.tsx:634`, `:659`, `:733` — `role="menuitem"` aplicado ao **host** do custom element (`bth-menu-horizontal-item`, `bth-menu-vertical-item`), enquanto o elemento realmente focável é a `<a>` dentro do shadow DOM. O papel e o alvo de foco estão em nós diferentes.
- `src/components/comuns/navbar-pill/navbar-pill-group/navbar-pill-group.tsx:18` e `navbar-pill-item.tsx:55` — mesmo problema: `role="menuitem"` em uma `<div>` que contém a âncora focável.

Além disso o padrão `menubar` da APG exige navegação por setas, Home/End e roving tabindex — nada disso existe. Correção: para navegação de site, usar `<nav><ul><li><a>` sem `role`, marcando o item atual com `aria-current="page"`. Reservar `menubar` para menus de aplicação com o teclado implementado.

### A5. Conteúdo focável dentro de `aria-hidden` (4.1.2, 1.3.1)

- `src/components/app/menu-painel-lateral/menu-painel-lateral.tsx:168`–`174` — `aria-hidden` no `<Host>` e no painel.
- `src/components/app/menu-painel-lateral/menu-painel-lateral.scss:3`–`26` — o estado fechado usa apenas `opacity: 0` + `transform: translateX(100%)`. O painel continua no fluxo e focável.
- `src/components/app/menu-painel-lateral/menu-painel-lateral.tsx:118` — o slot só é removido após `TIMEOUT_INTERACOES` (300 ms, `src/global/constants.ts:3`). Durante a transição há conteúdo focável sob `aria-hidden="true"`.

Os botões `.btn-back`/`.btn-close` do cabeçalho são renderizados sempre, independente de `show`. Correção: alternar `display`/`visibility` ou usar o atributo `inert` no estado fechado.

### A6. `aria-expanded` + `aria-pressed` no mesmo controle (4.1.2)

- `src/components/app/app.tsx:610`–`611` e `:686`–`687`.

Os dois atributos comunicam estados diferentes para o mesmo botão e se contradizem para o leitor de tela. Correção: manter só `aria-expanded`.

### A7. `aria-haspopup` no contêiner errado (4.1.2)

- `src/components/app/menu-ferramenta/menu-ferramenta.tsx:117`, `:128`, `:137` — `aria-haspopup` na `<div>` externa, não na âncora que abre o painel. `aria-haspopup="false"` em `:117` é redundante.

Também falta `aria-expanded` e `aria-controls` no acionador do painel lateral, embora ele controle um painel.

### A8. Ícones decorativos anunciados com nome sem sentido (1.1.1)

- `src/components/comuns/icone/icone.tsx:44`–`51` — `role="img"` com `aria-label` derivado do nome do ícone (`chevron-up` vira "chevron up", `account` vira "account").

Cada ícone decorativo vira um elemento anunciado em inglês, dentro de uma interface em português, frequentemente duplicando o rótulo do controle que o contém (ex.: `menu-vertical-item.tsx:135`). Correção: `aria-hidden="true"` por padrão e `role="img"` + rótulo apenas quando `ariaLabel` for informado explicitamente.

---

## B. Nível AA

### B1. Contraste insuficiente em badges de status (1.4.3 AA / 1.4.11 AA)

Razões calculadas sobre os tokens resolvidos:

| Uso | Par | Razão | AA (4.5) | AAA (7) |
|---|---|---|---|---|
| Badge branco sobre vermelho | `#ffffff` / `#dd413c` | **4.29** | falha | falha |
| Badge "Online" branco sobre verde | `#ffffff` / `#3ec18f` | **2.28** | falha | falha |

Ocorrências: `src/components/app/app.scss:256`–`257` (`.badge-danger`), `src/components/app/menu-vertical-item/menu-vertical-item.scss:153`–`154` (`.badge-vertical-floating`), e `status--success`/`status--danger` em `src/components/suporte/suporte.tsx:123` e `:125`. Agrava-se porque a fonte é 10–12px (`menu-vertical-item.scss:155`, `app.scss:250`), abaixo do limiar de texto grande.

### B2. Ícone de fechar com contraste 1,84:1 (1.4.11 AA)

- `src/components/app/menu-painel-lateral/menu-painel-lateral.scss:60`–`62` — `color: #767676` sobrescrito por `color: silver !important` (`#c0c0c0`) sobre fundo branco. Razão **1,84:1**; o mínimo para componente de interface é 3:1. O `!important` também impede correção pelo consumidor.

### B3. Indicador de foco de 1px pontilhado (1.4.11 AA, 2.4.13 AAA)

- `src/styles/normalize.scss:15`–`16`, `src/styles/_base.scss:40`–`41`, `src/components/app/app.scss:196`, `:237`, `:318`, `menu-vertical-item.scss:66`, `:91`, `:136`, `menu-ferramenta.scss:53`.

`outline: 1px dotted` com `outline-offset` negativo: a borda pontilhada reduz a área efetivamente contrastante e 1px não satisfaz 2.4.13 (perímetro mínimo de 2px CSS e contraste 3:1 contra os estados adjacentes). Correção: `outline: 2px solid` + `outline-offset: 2px`, usando `:focus-visible`.

### B4. Estado ativo comunicado só por cor (1.4.1 A / 1.3.1 A)

- `menu-vertical-item.tsx:107`, `menu-horizontal-item.tsx:65`, `navbar-pill-item.tsx:55` — a prop `ativo` só aplica classe CSS. Nenhum `aria-current`.

---

## C. Critérios específicos de AAA

### C1. Contraste ampliado 7:1 — 1.4.6 (falha)

Pares que passam em AA e falham em AAA:

| Par | Razão | Onde |
|---|---|---|
| `--bth-app-blue` sobre branco | **4.50** | link/realce padrão |
| branco sobre `--bth-app-blue` | **4.50** | botões primários |
| `--bth-app-blue-dark-10` sobre `gray-light-10` | **4.95** | `app.scss:357` |
| `gray-dark-20` sobre `gray-light-30` | **6.42** | `app.scss:310` |
| `gray-dark-10` sobre branco | **4.60** | textos secundários |
| `gray-dark-30` sobre `red-light-20` | **6.91** | banner de erro, `app.scss:101` |

Passam em AAA: branco sobre `menu-bg` (17,19), `gray-dark-30` sobre branco (15,52), banner de aviso (9,56) e de info (9,38).

Correção mínima para AAA: escurecer `--bth-app-blue` de `#3374db` para algo próximo de `#1f56ab` (≥7:1 sobre branco) e promover `gray-dark-10`/`gray-dark-20` para `gray-dark-30` em texto.

### C2. Apresentação visual — 1.4.8 (falha)

- Nenhum mecanismo para o usuário definir cor de primeiro plano e de fundo (os tokens são sobrescrevíveis pelo integrador, não pelo usuário final).
- `src/styles/_base.scss:71` fixa `line-height: 1.2` em títulos; 1.4.8 exige 1,5 dentro de parágrafos e ao menos espaçamento equivalente. `normalize.scss:7` usa 1.5 no corpo — correto.
- Largura de linha não é limitada a 80 caracteres em nenhum painel.

### C3. Teclado sem exceção — 2.1.3 (falha)

Consequência direta de A1–A4.

### C4. Sem tempo limite / interrupções — 2.2.3, 2.2.4 (falha parcial)

- `src/global/constants.ts:3` (`TIMEOUT_INTERACOES = 300`) e `menu-painel-lateral.tsx:87`, `:118` — abertura e fechamento por temporizador.
- `menu-painel-lateral.tsx` `onMouseLeave` fecha o painel automaticamente. Um usuário com limitação motora perde o conteúdo sem ação intencional.

### C5. Animação a partir de interações — 2.3.3 (falha)

Nenhuma ocorrência de `prefers-reduced-motion` no repositório. Há transições e animações em `global.css`, `app.scss`, `menu-vertical-item.scss`, `menu-painel-lateral.scss`, `menu-ferramenta-icone.scss`, `loader.scss` e `notificacao-item.scss` — incluindo o `translateX(100%)` de 375px do painel lateral. Correção: bloco `@media (prefers-reduced-motion: reduce) { transition: none; animation: none; }`.

### C6. Localização — 2.4.8 (falha)

Sem `aria-current`, sem trilha de navegação. O usuário de leitor de tela não sabe qual item do menu representa a posição atual (ver B4).

### C7. Finalidade do link no próprio link — 2.4.9 (falha)

- `novidade-item.tsx` — "Mais detalhes".
- `notificacao-item.tsx` — "Acompanhar" e "Cancelar".
- `marca-produto.tsx:264` — "Ver todos".
- `app.tsx:581` — "Mais informações" no banner.

Os `title` repetem o mesmo texto e não desambiguam. Em uma lista com N notificações há N links "Acompanhar" idênticos. Correção: `aria-label` incluindo o assunto do item.

### C8. Tamanho do alvo — 2.5.5 (falha)

AAA exige 44×44 px CSS.

- `menu-ferramenta-icone.scss:18` e `:54` — badges com `min-width: 10px`.
- `menu-painel-lateral.scss:46`–`69` — `.btn-back`/`.btn-close` com `padding: 0px 8px` e sem altura mínima.
- `notificacao-item.tsx:229` e `novidade-item.tsx:86` — alternador de lido/não lido é um ícone isolado.

### C9. Abreviações, nível de leitura, pronúncia — 3.1.3 a 3.1.6 (falha)

- `conta-usuario.tsx` exibe `@{usuario}` sem `<abbr>` nem expansão.
- Ícones em inglês dentro de conteúdo `lang="pt-br"` (ver A8) e nenhum `lang` em partes estrangeiras (3.1.2 é nível AA).
- Nenhum mecanismo de glossário ou de versão simplificada.

### C10. Mudança sob demanda — 3.2.5 (falha)

Abertura por `onMouseOver` muda o contexto sem ação deliberada do usuário:

- `app.tsx:607`–`608` (botão do menu), `menu-ferramenta.tsx:141`–`142`, `menu-painel-lateral.tsx` (`onMouseOver`/`onMouseLeave`), `marca-produto.tsx:245`–`246`.

Correção: abrir apenas por clique/Enter, ou oferecer preferência para desativar a abertura por hover. Isso também afeta 1.4.13 (nível AA): o conteúdo em hover não é dispensável com Esc nem persistente — **não há nenhum tratamento de `Escape` no repositório** (grep por `event.key` retorna apenas `ArrowUp`/`ArrowDown` em `selecao-contexto.tsx:63`–`65`).

---

## D. Observações de estrutura

### D1. Hierarquia de títulos

`menu-painel-lateral.tsx:180` usa `<h3>`, `notificacoes.tsx` e `novidades.tsx` usam `<h4>` em estados vazios, `selecao-contexto.tsx:267` usa `<h4>`, `novidade-item.tsx:82` usa `<h5>`. Como cada componente é montado em contextos distintos, os níveis são arbitrários em relação ao documento hospedeiro. Recomendação: documentar o nível esperado ou expor uma prop de nível.

### D2. `href=""`

Em `menu-vertical-item.tsx:114`, `menu-horizontal-item.tsx:67`, `menu-ferramenta.tsx:129`/`:139`, `navbar-pill-item.tsx:56`, `selecao-contexto.tsx:238`, `conta-usuario.tsx:161`, `notificacoes.tsx:655`, `novidades.tsx:286`, `notificacao-item.tsx:229`, `app.tsx:602`/`:680`/`:755`.

`href=""` resolve para a própria URL. Se o JavaScript falhar ou o `preventDefault` não executar, a página recarrega. Além disso o leitor de tela anuncia "link" onde o comportamento é de botão.

### D3. Texto alternativo redundante

`empty-state.tsx:53`–`86` — o `alt` da imagem repete (ou amplia) o `<h4>` imediatamente seguinte. O conteúdo é anunciado duas vezes. Correção: `alt=""` nas ilustrações decorativas.

---

## E. O que já está correto

- `pesquisa.tsx` — `<iframe>` com `title` descritivo.
- `avatar.tsx:207` — `alt` derivado do `title`, com fallback.
- `empty-state` — todas as imagens possuem `alt`.
- `app.tsx` — uso de `<header role="banner">`, `<nav>`, `<main>`, `<aside>` e `aria-label` distinto por região de navegação.
- `utilitarios.tsx:56`–`68` — o único componente que usa `<button>` com `disabled` real, `aria-label` e `aria-disabled` coerentes.
- `index.html` e `componentes.html` — `lang="pt-br"`, `dir="ltr"`, hierarquia de títulos consistente.
- Texto principal sobre fundo claro e sobre o menu escuro já satisfaz AAA (15,52 e 17,19).

---

## F. Correção priorizada

1. **P0 — teclado**: trocar por `<button>`/`<a href>` os controles de A1 e A2; adicionar `Escape` para fechar painéis e dropdowns.
2. **P0 — ordem de foco**: remover o `tabindex` positivo de `selecao-contexto` (A3).
3. **P0 — ARIA**: remover `menubar`/`menuitem` onde não há teclado de menu, resolver a divergência papel/foco entre host e shadow DOM (A4), corrigir A5–A7.
4. **P1 — ícones**: `bth-icone` decorativo por padrão (A8); `alt=""` nas ilustrações de `empty-state`.
5. **P1 — contraste**: corrigir badges vermelho/verde e o `silver !important` (B1, B2); reforçar o indicador de foco para 2px sólido (B3).
6. **P2 — AAA de cor**: escurecer `--bth-app-blue` e os cinzas de texto para 7:1 (C1).
7. **P2 — movimento e hover**: `prefers-reduced-motion` (C5); abertura por hover opcional (C10).
8. **P3 — texto**: `aria-current` (B4/C6), rótulos de link autossuficientes (C7), alvos de 44px (C8).

---

## G. Ferramental

### G1. Sem verificação automatizada

Não há `axe-core`, `jest-axe` nem `pa11y` em `package.json` ou nos testes. As suítes e2e do Stencil usam Puppeteer, o que permite injetar `@axe-core/puppeteer` diretamente nos testes existentes.

### G2. Sem regra de lint para acessibilidade

O ESLint do projeto não inclui `eslint-plugin-jsx-a11y`. Boa parte de A1, A2 e D2 seria detectada na escrita — o mesmo mecanismo já usado para bloquear imports de `components/app` (commit `35139f3`).
