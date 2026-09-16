# Matriz de Acoplamento com `bth-app`

## Critérios
- **Contrato direto**: importa tipos de `app.interfaces` ou depende explicitamente dos eventos do shell, como `conteudoSinalizado`, `painelLateralShow`, `bannerAlterado`, `menuHorizontalSelecionado` e `menuVerticalSelecionado`.
- **Dependência estrutural**: foi desenhado para o núcleo do shell, para a área de ferramentas, para um slot do `bth-app` ou é independente.
- **Dependência visual**: usa tokens CSS `--bth-app-*`.
- **Classificação final**:
  - **Alto**: contrato direto ou papel de núcleo no shell.
  - **Médio**: sem contrato direto, mas com dependência estrutural clara do shell.
  - **Baixo**: sem contrato direto; o vínculo principal é visual ou indireto.
  - **Mínimo**: pode ser reutilizado fora do shell sem adaptação relevante.

## Resumo
- O acoplamento funcional forte está concentrado no pacote `src/components/app` e em `bth-notificacoes`/`bth-novidades`.
- O acoplamento estrutural médio aparece nos componentes de ferramentas e em `bth-marca-produto`.
- O acoplamento visual é amplo: 19 arquivos de estilo em `src/components/` usam tokens `--bth-app-*`.

## Matriz
| Componente | Contrato Direto | Dependência Estrutural | Dependência Visual | Classificação | Observação |
| --- | --- | --- | --- | --- | --- |
| `bth-app` | N/A | Raiz | Sim | Raiz | Define slots, métodos e eventos do shell. |
| `bth-menu-horizontal-item` | Sim | Núcleo | Sim | Alto | Item de navegação horizontal controlado pelo `bth-app`. |
| `bth-menu-vertical-item` | Sim | Núcleo | Sim | Alto | Item de navegação vertical recursivo do shell. |
| `bth-menu-painel-lateral` | Sim | Núcleo | Sim | Alto | Reage a `bannerAlterado` e coordena `painelLateralShow`. |
| `bth-notificacoes` | Sim | Ferramentas | Sim | Alto | Emite `conteudoSinalizado` e escuta `painelLateralShow`. |
| `bth-novidades` | Sim | Ferramentas | Sim | Alto | Mesmo padrão de integração de badge e abertura do painel. |
| `bth-menu-ferramenta` | Não | Ferramentas | Sim | Médio | Wrapper base das ferramentas laterais do shell. |
| `bth-menu-ferramenta-icone` | Não | Ferramentas | Sim | Médio | Ícone e badge desenhados especificamente para `bth-menu-ferramenta`. |
| `bth-utilitarios` | Não | Ferramentas | Não | Médio | Depende do wrapper de ferramentas, mas não conhece a API do `bth-app`. |
| `bth-suporte` | Não | Ferramentas | Sim | Médio | Ferramenta lateral composta sobre `bth-menu-ferramenta`. |
| `bth-ajuda` | Não | Ferramentas | Sim | Médio | Ferramenta lateral simples, sem contrato direto com o shell. |
| `bth-conta-usuario` | Não | Ferramentas | Sim | Médio | Usa `bth-menu-ferramenta` e tokens visuais do app. |
| `bth-marca-produto` | Não | Slot do `bth-app` | Sim | Médio | Foi desenhado para `menu_marca_produto`, mas sem depender de eventos do shell. |
| `bth-notificacao-item` | Não | Nenhuma | Sim | Baixo | Item interno de `bth-notificacoes`; não conhece `bth-app`. |
| `bth-novidade-item` | Não | Nenhuma | Sim | Baixo | Item interno de `bth-novidades`; vínculo principal é visual. |
| `bth-avatar` | Não | Nenhuma | Sim | Baixo | Componente reutilizável, mas estilizado com tokens do app. |
| `bth-loader` | Não | Nenhuma | Sim | Baixo | Reutilizável e sem contrato direto; acoplamento majoritariamente visual. |
| `bth-navbar-pill-group` | Não | Nenhuma | Sim | Baixo | Controle genérico de filtros; hoje herda o tema do app. |
| `bth-navbar-pill-item` | Não | Nenhuma | Sim | Baixo | Item de filtro genérico; vínculo mais forte é visual. |
| `bth-selecao-contexto` | Não | Nenhuma | Sim | Baixo | Pode compor a área de contexto, mas não depende do shell. |
| `bth-pesquisa` | Não | Nenhuma | Não | Mínimo | Pode ser usado em `container_aplicacao`, mas o código não conhece `bth-app`. |
| `bth-empty-state` | Não | Nenhuma | Não | Mínimo | Componente genérico e independente do shell. |
| `bth-icone` | Não | Nenhuma | Não | Mínimo | Base visual reutilizável, sem dependência estrutural do app. |

## Leitura rápida
- **Altamente acoplados**: núcleo de navegação/painel e componentes que conversam com o shell por evento.
- **Mediamente acoplados**: componentes feitos para ocupar áreas do shell, principalmente a barra de ferramentas.
- **Baixamente acoplados**: componentes reaproveitáveis cujo vínculo mais forte com o shell é visual.
- **Minimamente acoplados**: componentes independentes, reutilizáveis fora do `bth-app`.
