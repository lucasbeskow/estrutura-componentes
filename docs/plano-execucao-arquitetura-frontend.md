# Plano de execução — evolução da arquitetura frontend

Status geral: `planejado`

Última atualização: 2026-09-18 (revisão após verificação do plano contra o código)

## Objetivo

Reduzir o acoplamento dos Web Components à infraestrutura da plataforma, fortalecer os contratos tipados e preparar a base para evolução segura sem alterar o comportamento público dos componentes.

## Critérios gerais de segurança

- Cada fase deve ser pequena, revisável e executável isoladamente.
- Não alterar nomes de tags, propriedades, métodos, slots ou eventos públicos sem decisão explícita de compatibilidade.
- Antes de cada fase, verificar `git status --short` e preservar alterações existentes.
- Executar pelo menos `yarn lint` e o conjunto de testes relacionado à fase.
- Executar `yarn test.spec` ao concluir cada grupo de mudanças de produção.
- Executar `yarn build` antes de considerar uma fase de API ou empacotamento concluída.
- Atualizar os `readme.md` afetados quando um contrato público mudar.
- Classificar cada fase quanto ao impacto de versão do pacote, conforme a decisão 6.
- Manter cada migração por domínio em um commit próprio e revertível isoladamente.

## Estado de acompanhamento

Marcação usada:

- `[ ]` não iniciado
- `[~]` em andamento
- `[x]` concluído
- `[!]` bloqueado ou aguardando decisão

| Fase | Estado | Responsável | Esforço | Impacto de versão | Resultado esperado |
| --- | --- | --- | --- | --- | --- |
| H1 — Hotfix de autorização | `[ ]` | a definir | P | patch | retry de `401` usa a autorização vigente |
| F0 — Baseline | `[ ]` | a definir | P | nenhum | fotografia reproduzível da base |
| F1 — Autorização e HTTP | `[ ]` | a definir | M | minor | API HTTP tipada, cancelável e com URLs normalizadas |
| F2 — Configuração de ambiente | `[ ]` | a definir | G | minor | resolução centralizada de endpoints |
| F3 — Eventos e contratos | `[ ]` | a definir | M | minor | eventos documentados e tipados |
| F4 — WebSocket e timers | `[ ]` | a definir | M | minor | ciclo de vida previsível |
| F5 — Tipagem de domínios | `[ ]` | a definir | G | minor | redução controlada de `any` |
| F6 — Extração de responsabilidades | `[ ]` | a definir | G | patch | componentes menores e mais testáveis |
| F7 — Migração do runner de testes | `[ ]` | a definir | G | nenhum | testes independentes do runner deprecated |
| F8 — Fechamento | `[ ]` | a definir | P | conforme fases | build, documentação e checklist final |
| F9 — Ambiente de mock | `[ ]` | a definir | M | nenhum | demo executável sem os serviços reais |

Escala de esforço: `P` até meio dia, `M` até dois dias, `G` acima de dois dias.

## H1 — Hotfix de autorização no retry de `401`

Prioridade: máxima. Executar antes de concluir o F0, como entrega isolada.

Objetivo: corrigir o uso de credencial obsoleta no retry automático, sem esperar as fases de arquitetura.

Situação verificada no código: todos os serviços resolvem a autorização uma única vez, no construtor, e entregam o objeto já resolvido para `Api`, que o mantém em campo privado e o lê em `getHeaders()`.

Ocorrências confirmadas:

- [`src/global/api.ts:22`](../src/global/api.ts) — `Api` guarda `authorization` recebido no construtor.
- [`src/components/notificacoes/notificacoes.service.ts:9`](../src/components/notificacoes/notificacoes.service.ts)
- [`src/components/novidades/novidades.service.ts:11`](../src/components/novidades/novidades.service.ts)
- [`src/components/assistente/assistente.service.ts:10`](../src/components/assistente/assistente.service.ts)
- [`src/components/assistente/execucoes/execucoes.service.ts:10`](../src/components/assistente/execucoes/execucoes.service.ts)
- [`src/components/pesquisa/pesquisa.service.ts:10`](../src/components/pesquisa/pesquisa.service.ts) e linha 11
- [`src/components/suporte/licencas.service.ts:9`](../src/components/suporte/licencas.service.ts)
- [`src/components/marca-produto/marca-produto.tsx:104`](../src/components/marca-produto/marca-produto.tsx) — passa a autorização já resolvida.

### Tarefas

- [ ] Aceitar em `Api` um provedor `() => Authorization`, mantendo compatibilidade com o objeto atual.
- [ ] Ler a autorização no momento de montar os headers.
- [ ] Atualizar os sete pontos de construção listados acima para entregar o provedor.
- [ ] Adicionar teste em que o primeiro token falha, a renovação produz novo token e o retry usa o novo token.
- [ ] Adicionar teste garantindo que um segundo `401` não entra em loop.

### Teste de saída

- `yarn lint`
- testes de [`src/global/test/api.spec.ts`](../src/global/test/api.spec.ts)
- `yarn test.spec`

### Critério de conclusão

Nenhuma requisição de retry usa uma autorização capturada antes da renovação. Entregue como versão `patch`, em commit próprio, independente do restante do plano.

## F0 — Baseline reproduzível

Objetivo: registrar o estado atual antes de qualquer alteração.

### Tarefas

- [ ] Registrar branch, commit e `git status --short`.
- [ ] Executar `yarn lint` e salvar quantidade de erros/warnings.
- [ ] Executar `yarn test.spec` e registrar suítes, testes, cobertura e avisos.
- [ ] Executar `yarn build` e registrar warnings/erros.
- [ ] Confirmar que não existem alterações geradas indevidas em `dist/`, `www/`, `coverage/` ou `.stencil/`.
- [ ] Criar uma tabela de contratos públicos atuais dos domínios: `app`, `notificacoes`, `novidades`, `assistente`, `suporte` e `pesquisa`.
- [ ] Gerar o baseline de regressão visual com `yarn test.screenshot` e registrar onde as imagens ficam versionadas.
- [ ] Inventariar a configuração de CI em uso: arquivos, comandos executados, versão de Node e passos de publicação.
- [ ] Registrar o delta da branch atual antes de começar. Em 2026-09-18 a branch `feature-assistente` continha alterações não commitadas em `.gitignore`, `package.json`, `src/componentes.html`, `src/index.html`, `yarn.lock` e o diretório não versionado `mock/`. Rodar o baseline em base limpa ou documentar explicitamente esse delta.

### Teste de saída

O baseline deve ser executável por outra pessoa e conter os resultados dos três comandos principais, o baseline de screenshots e o inventário de CI.

### Dependências

Nenhuma.

## F1 — Autorização e camada HTTP

Prioridade: alta.

Objetivo: eliminar o risco de retry com token obsoleto e estabelecer comportamento HTTP previsível.

Arquivos de referência: [`src/global/api.ts`](../src/global/api.ts), [`src/global/interfaces.ts`](../src/global/interfaces.ts), testes em [`src/global/test/api.spec.ts`](../src/global/test/api.spec.ts).

### F1.1 — Decisão sobre o contrato de autorização

- [ ] Confirmar se `getAuthorization()` pode retornar um novo objeto após renovação.
- [ ] Confirmar se `handleUnauthorizedAccess()` atualiza o token de forma mutável ou substitui o objeto.
- [ ] Definir se a API deve obter autorização em toda requisição ou receber uma função `getAuthorization`.

### F1.2 — Consolidar o retry de `401`

A correção em si sai em H1. Esta etapa consolida o contrato definitivo.

- [ ] Remover o suporte temporário ao objeto de autorização capturado, depois que todos os consumidores usarem o provedor.
- [ ] Manter apenas um retry automático por requisição.
- [ ] Preservar o comportamento atual para respostas não-2xx.
- [ ] Tipar o retorno do provedor e remover conversões implícitas.

### F1.3 — Normalizar requisições

- [ ] Normalizar combinação de `baseUrl` e `path`, evitando `//` acidental.
- [ ] Definir uma função para montar query strings com `URLSearchParams`.
- [ ] Codificar filtros, identificadores e valores de paginação.
- [ ] Manter testes de URLs existentes e adicionar casos com caracteres especiais.
- [ ] Corrigir a concatenação atual `${this.baseUrl}/${path}` em [`src/global/api.ts:28`](../src/global/api.ts), que produz `//` quando `path` já começa com barra.

### F1.4 — Cancelamento, tempo limite e corpo de requisição

Hoje `Api.request` aceita apenas método e caminho. Não há `AbortSignal`, tempo limite nem corpo. Sem cancelamento não é possível tratar a desmontagem durante uma requisição pendente, exigida em F4.2.

- [ ] Aceitar `AbortSignal` opcional em `request`.
- [ ] Definir tempo limite padrão e documentá-lo.
- [ ] Definir se o corpo de requisição entra agora ou fica registrado como pendência explícita.
- [ ] Garantir que um retry de `401` respeite o sinal de cancelamento e não reemita a requisição abortada.
- [ ] Adicionar testes de cancelamento antes da resposta e de cancelamento durante o retry.

### Teste de saída

- `yarn lint`
- testes de `src/global/test/api.spec.ts`
- testes dos serviços afetados
- `yarn test.spec`
- `yarn build`

### Critério de conclusão

Nenhuma requisição de retry usa uma autorização capturada antes da renovação, e os contratos existentes permanecem compatíveis.

## F2 — Configuração de ambiente e endpoints

Prioridade: alta.

Objetivo: retirar dos componentes a duplicação de leitura de `window.___bth`.

Arquivos de referência: [`src/global/bth.d.ts`](../src/global/bth.d.ts), `get*Api()` e `get*Home()` nos componentes funcionais.

### F2.1 — Inventário e contrato

- [ ] Listar todas as chaves atualmente lidas de `window.___bth.envs.suite`.
- [ ] Listar propriedades que têm fallback explícito.
- [ ] Definir o comportamento para endpoint ausente: `undefined`, erro de configuração ou estado indisponível.
- [ ] Decidir se a configuração será apenas global, apenas por propriedade ou híbrida como hoje.

### F2.2 — Criar resolvedor central

- [ ] Criar módulo em `src/global/` para resolver endpoints e homes.
- [ ] Criar tipos para grupos de serviço e caminhos conhecidos.
- [ ] Permitir override explícito por propriedade do componente.
- [ ] Remover acessos diretos duplicados ao objeto global, gradualmente por domínio.
- [ ] Adicionar testes para override, configuração global, ausência de configuração e precedência.

### F2.3 — Migrar por domínio

Há 32 leituras diretas de `window.___bth` em dez componentes. Cada domínio abaixo deve virar um commit próprio, revertível isoladamente, com os testes do domínio verdes antes do commit seguinte.

- [ ] `notificacoes`
- [ ] `novidades`
- [ ] `assistente`
- [ ] `marca-produto`
- [ ] `pesquisa`
- [ ] `suporte`

### Teste de saída

Cada domínio migrado deve manter os testes de configuração inválida e os testes de integração do serviço. A aplicação sem `env.js` deve continuar funcionando quando as propriedades explícitas forem informadas.

## F3 — Eventos e contratos públicos

Prioridade: média/alta.

Objetivo: tornar explícita a comunicação entre componentes sem introduzir acoplamento ao `bth-app`.

Arquivos de referência: [`src/global/eventos.interfaces.ts`](../src/global/eventos.interfaces.ts), [`CONTRIBUTING.md`](../CONTRIBUTING.md), componentes que usam `@Listen` e `@Event`.

### Tarefas

- [ ] Inventariar todos os eventos emitidos e escutados, incluindo escopo `window`.
- [ ] Registrar para cada evento: emissor, consumidores, payload, propagação e efeito.
- [ ] Mover payloads compartilhados para `src/global/` quando houver uso entre domínios.
- [ ] Substituir `CustomEvent` sem tipo por interfaces específicas.
- [ ] Eliminar `any` dos eventos públicos sem quebrar os tipos gerados.
- [ ] Decidir se os nomes atuais serão preservados ou se haverá aliases versionados.
- [ ] Adicionar testes de payload e de propagação para eventos centrais.
- [ ] Atualizar documentação dos componentes.

### Teste de saída

Para cada evento central deve existir pelo menos um teste que valide o payload e um teste que valide o efeito no consumidor.

### Ponto de decisão

Não renomear eventos nesta fase sem definir estratégia de compatibilidade para aplicações consumidoras.

## F4 — WebSocket, polling e ciclo de vida

Prioridade: alta.

Objetivo: tornar reconexão, polling e timers determinísticos e seguros.

Arquivos de referência: [`src/components/notificacoes/notificacoes.websocket.ts`](../src/components/notificacoes/notificacoes.websocket.ts), [`src/components/notificacoes/notificacoes.tsx`](../src/components/notificacoes/notificacoes.tsx), [`src/components/novidades/novidades.tsx`](../src/components/novidades/novidades.tsx).

### F4.1 — Estado do WebSocket

- [ ] Definir estados `idle`, `connecting`, `connected`, `reconnecting`, `closed` e `error`.
- [ ] Validar a URL WebSocket antes de criar a conexão.
- [ ] Definir quais códigos de fechamento permitem reconexão. Hoje `CODES_TO_RECONNECT` cobre `1001` e `1006`.
- [ ] Definir limite de tentativas e teto de backoff. Hoje `refreshTime += RETRY_TIMEOUT_IN_MS` cresce de forma linear e ilimitada.
- [ ] Evitar renovar autorização em encerramentos que não indicam expiração. Hoje `handleUnauthorizedAccess()` é chamado em toda reconexão, inclusive em `1006`, que costuma indicar queda de rede.
- [ ] Garantir que `close()` cancele reconexões pendentes. Hoje o `setTimeout` agendado em [`notificacoes.websocket.ts:49`](../src/components/notificacoes/notificacoes.websocket.ts) verifica `this.closed` apenas no momento do evento `close`, e não no disparo do temporizador, então uma reconexão pode ocorrer depois de `close()`.
- [ ] Fechar a conexão anterior dentro de `refresh()`. Hoje o método cria um novo `WebSocket` e abandona o anterior sem chamar `close()`, deixando socket e listeners antigos ativos.
- [ ] Garantir que listeners não sejam duplicados após `refresh()`.
- [ ] Tratar `close()` após `this.webSocket = null`, evitando acesso a conexão inexistente em chamadas repetidas.

### F4.2 — Polling de novidades

- [ ] Evitar chamadas concorrentes quando o polling anterior ainda estiver ativo.
- [ ] Definir intervalo configurável ou constante documentada.
- [ ] Limpar polling durante reconfiguração e `disconnectedCallback`.
- [ ] Testar desmontagem durante uma requisição pendente.

### F4.3 — Timers gerais

- [ ] Inventariar `setTimeout`, `setInterval` e listeners de `window`.
- [ ] Criar helpers de cleanup quando houver repetição.
- [ ] Adicionar testes com fake timers nos fluxos afetados, usando timers legacy quando necessário.

### Teste de saída

- testes de WebSocket existentes mais casos de reconexão, fechamento e duplicidade;
- testes de polling e desmontagem;
- `yarn test.spec`;
- `yarn test.e2e` para os fluxos visíveis, se o ambiente estiver disponível.

## F5 — Tipagem dos domínios

Prioridade: alta, depois de F1 e F2.

Objetivo: substituir estruturas implícitas de backend por contratos explícitos.

O `any` explícito nos componentes é pontual: quatro ocorrências em `assistente.tsx`, uma em `novidades.tsx` e uma em `suporte.tsx`. A tipagem implícita concentra-se nos serviços e nas interfaces de domínio, portanto a fase deve avançar por arquivo de serviço e interface, e só depois pelo componente que os consome.

### Ordem sugerida

1. [ ] Notificações e paginação.
2. [ ] Novidades.
3. [ ] Assistente e tags.
4. [ ] Execuções.
5. [ ] Produtos e suporte.
6. [ ] Pesquisa.

### Tarefas por domínio

- [ ] Modelar resposta de sucesso.
- [ ] Modelar resposta paginada.
- [ ] Modelar erro de integração quando necessário.
- [ ] Alterar serviços para retornar tipos específicos.
- [ ] Alterar `@State`, `@Prop` e eventos relacionados.
- [ ] Remover `any` somente após os testes do domínio estarem verdes.
- [ ] Registrar campos desconhecidos como `unknown`, não como `any`.

### Teste de saída

O compilador deve impedir acesso a campos inexistentes nas respostas modeladas. A cobertura de branches do domínio não deve cair sem justificativa documentada.

## F6 — Extração de responsabilidades dos componentes

Prioridade: média.

Objetivo: reduzir componentes que misturam renderização, regras de negócio e infraestrutura.

Dependência: iniciar somente após F5 do domínio correspondente. Extrair regras ainda tipadas de forma implícita gera retrabalho na assinatura das funções extraídas.

### Ordem sugerida

- [ ] Extrair máquina/reducer de estado do `bth-notificacoes`.
- [ ] Extrair transformação e filtragem de `bth-novidades`.
- [ ] Extrair paginação e filtros do `bth-assistente`.
- [ ] Extrair normalização de opções e estado do `bth-app`.
- [ ] Extrair regras de responsividade que se repetem entre componentes.

### Regras

- A extração deve ser função ou classe pura sempre que possível.
- O componente deve continuar sendo o adaptador entre DOM e estado.
- O serviço não deve conhecer elementos, Shadow DOM ou `window` além do necessário para sua infraestrutura.
- Cada extração deve vir acompanhada de testes unitários próprios.

### Teste de saída

Cada componente reduzido deve manter seus testes existentes e ganhar testes para as regras extraídas. O HTML público não deve mudar sem necessidade, e a ausência de mudança visual deve ser comprovada com `yarn test.screenshot` contra o baseline gerado em F0.

## F7 — Migração do runner de testes

Prioridade: alta antes de atualizar para Stencil 5.

Objetivo: remover dependência do runner integrado deprecated do Stencil.

### Tarefas

- [ ] Revisar o inventário de CI levantado em F0 e definir onde o novo pipeline será executado.
- [ ] Escolher entre `@stencil/vitest` e a divisão Vitest + Playwright.
- [ ] Criar configuração mínima paralela sem remover o runner atual.
- [ ] Migrar primeiro testes puros de `utils`, `global/api` e serviços.
- [ ] Migrar testes de componentes simples.
- [ ] Migrar testes de componentes com Shadow DOM e eventos.
- [ ] Migrar testes E2E e acessibilidade.
- [ ] Comparar cobertura e tempo de execução com o baseline.
- [ ] Remover o runner antigo somente após equivalência comprovada.

### Teste de saída

O pipeline novo deve executar os mesmos cenários essenciais, gerar cobertura comparável e não depender dos avisos do runner deprecated.

## F8 — Fechamento e governança

Objetivo: consolidar o resultado e permitir retomada futura.

### Tarefas

- [ ] Atualizar readmes e contratos públicos.
- [ ] Atualizar `CONTRIBUTING.md` com a arquitetura adotada.
- [ ] Registrar decisões arquiteturais relevantes em `docs/decisoes/`.
- [ ] Atualizar este plano com estados, commits e pendências.
- [ ] Executar `yarn lint`.
- [ ] Executar `yarn test`.
- [ ] Executar `yarn build`.
- [ ] Conferir `git diff --stat`, arquivos gerados e compatibilidade do pacote.
- [ ] Executar `yarn test.screenshot` e comparar com o baseline de F0.
- [ ] Definir a versão de publicação conforme a decisão 6 e registrar a justificativa.

### Critério de conclusão

O plano só pode ser marcado como concluído quando os comandos de lint, testes e build estiverem verdes ou quando cada exceção estiver registrada com justificativa e decisão de produto/arquitetura.

## F9 — Ambiente de mock das APIs

Prioridade: baixa. Executar por último, depois de F8.

Objetivo: permitir rodar a demo e o guia de componentes com dados, sem depender dos serviços reais da Betha.

Motivo de ficar por último: o mock precisa refletir os contratos já estabilizados. Construí-lo antes de F1, F2, F4 e F5 significa escrever rotas e dados contra contratos que ainda vão mudar, e depois refazer o mesmo trabalho.

### F9.1 — Infraestrutura

- [ ] Adicionar `json-server` e `ws` como dependências de desenvolvimento.
- [ ] Criar `mock/server.js`, um `json-server` com rotas customizadas e um canal WebSocket.
- [ ] Definir a porta padrão `3001`, sobrescrevível por `MOCK_PORT`.
- [ ] Copiar `mock/db.json` para `mock/.runtime-db.json` a cada inicialização, para que as escritas da interface não sujem o arquivo versionado.
- [ ] Ignorar `mock/.runtime-db.json` no `.gitignore`.
- [ ] Adicionar os scripts `mock` e `start.mock` ao `package.json`.

### F9.2 — Resolução de ambiente

- [ ] Criar `mock/env.js` apontando todas as chaves de `window.___bth.envs.suite` para o servidor local.
- [ ] Servir esse arquivo em `GET /env.js` a partir do próprio mock.
- [ ] Fazer `src/index.html` e `src/componentes.html` carregarem o `env.js` local, mantendo o `env.js` remoto comentado logo acima como alternativa.
- [ ] Rever as chaves dessa etapa contra o resolvedor central criado em F2, que passa a ser a fonte da lista de endpoints.

Chaves cobertas: `user-accounts`, `suite-ui`, `studio-ui`, `central-usuarios`, `central-de-ajuda`, `licenses`, `pesquisa`, `avisos`, `notifications`, `notifications-ws`, `plataforma-extensoes`, `plataforma-execucoes`, `assinador` e `plataforma-consulta-execucoes`. As quatro primeiras que apontam para serviços públicos podem continuar com a URL real.

### F9.3 — Dados

- [ ] Criar `mock/db.json` com as coleções `produtos`, `atendimento`, `pesquisa`, `novidades`, `notificacoes`, `extensoes`, `tags` e `execucoes`.
- [ ] Usar os tipos definidos em F5 como referência do formato de cada coleção.
- [ ] Cobrir os estados de interface que importam: notificação lida, não lida, em progresso, extensão favoritada e não favoritada, execução concluída e com erro.

### F9.4 — Rotas

- [ ] Implementar a paginação no formato `{ content, hasNext, total }`, lendo `offset` e `limit` da query.
- [ ] Interpretar o filtro do assistente, que chega como texto: `natureza = 'RELATORIO'`, `natureza = 'SCRIPT'`, `favorita = true`, `titulo like '%termo%'` e `tagsE in (new Tag('rotulo'))`.
- [ ] Implementar as rotas abaixo.

| Serviço | Rota | Observação |
| --- | --- | --- |
| user-accounts | `GET /user-accounts/api/access/:accessId/systems` | produtos do `bth-marca-produto` |
| licenses | `GET /licenses/api/entidades/atual/id-pesquisa` | id da pesquisa de satisfação |
| licenses | `GET /licenses/api/atendimento` | link de atendimento do `bth-suporte` |
| pesquisa | `GET /pesquisa/index.jsp` | responde o texto `true` ou `false` |
| avisos | `GET /avisos/api/novidades` | lista do `bth-novidades` |
| notifications | `GET /notifications/api/messages/` | paginado |
| notifications | `GET /notifications/api/messages/unreads/all` | não lidas fora de progresso |
| notifications | `GET /notifications/api/messages/reads` | lidas |
| notifications | `GET /notifications/api/messages/in-progress` | em progresso |
| notifications | `PUT /notifications/api/messages/:id/read` e `/unread` | alterna a leitura |
| notifications | `DELETE /notifications/api/messages/unread` | aceita `keepInProgress=true` |
| notifications | `DELETE /notifications/api/messages/in-progress/unread` | marca as em progresso como lidas |
| plataforma-extensoes | `GET /plataforma-extensoes/api/extensao` | aplica o filtro do assistente |
| plataforma-extensoes | `GET /plataforma-extensoes/api/tag/:tipo` | tags paginadas |
| plataforma-extensoes | `PUT` e `DELETE /plataforma-extensoes/api/extensao/:tipo/:id/favoritos` | favoritar |
| plataforma-extensoes | `GET /plataforma-extensoes/v1/api/execucoes/f4` e `/minhas` | o assistente consulta execuções por este host, com prefixo `v1` |
| plataforma-execucoes | `GET /plataforma-execucoes/api/execucoes/f4` e `/minhas` | histórico de execuções |
| plataforma-execucoes | `GET /plataforma-execucoes/api/execucoes/:id/conclusao` | mensagem de conclusão |
| plataforma-execucoes | `GET /plataforma-execucoes/download/api/execucoes/:id/resultado` | download simulado |
| assinador | `GET /assinador/api-download/documentos/:id/download-assinado` | download simulado |

### F9.5 — Canal WebSocket

- [ ] Expor `ws://localhost:3001/notifications/v2/channel`.
- [ ] Responder às mensagens `STARTED` e `RESTARTED` com os contadores de não lidas e de não lidas em progresso.
- [ ] Publicar uma notificação nova em intervalo configurável, para exercitar o toast e o contador do menu.
- [ ] Encerrar o intervalo no fechamento do socket.
- [ ] Usar o canal para validar manualmente os estados de reconexão definidos em F4.1.

### F9.6 — Documentação

- [ ] Criar `mock/README.md` com uso, endpoints, porta e forma de editar os dados.
- [ ] Referenciar o mock no `CONTRIBUTING.md`.

### Teste de saída

- `yarn mock` sobe o servidor sem erro;
- `yarn start.mock` permite abrir `http://localhost:3333` e `http://localhost:3333/componentes.html` com dados em todos os componentes;
- `yarn lint` cobre os arquivos novos, ou a exclusão está registrada no `eslint.config`;
- a demo continua funcionando com o `env.js` remoto quando o mock não está no ar.

### Critério de conclusão

Uma pessoa sem acesso aos serviços da Betha consegue subir a demo com dados usando apenas os comandos documentados. O mock não é dependência de build nem de teste automatizado.

## Ordem recomendada de execução

```text
H1
 ↓
H1
 ↓
F0
 ↓
F1 ─────┐
        ├── F3 ─────────┐
F2 ─────┘               ├── F6 ── F8 ── F9
 ↓                      │
F4 ── F5 ───────────────┘
 ↓
F7
```

H1 é entrega isolada e antecede todo o restante. F1 e F2 podem avançar em paralelo depois do baseline. F3 depende da decisão sobre compatibilidade dos eventos. F5 deve começar somente quando os contratos de infraestrutura estiverem estáveis. F6 depende de F3 e de F5, porque extrai regras cujos tipos e eventos precisam estar estáveis. F7 pode começar em paralelo como spike, mas a migração completa deve considerar as alterações das fases anteriores. F9 fecha o ciclo e depende de contratos já estáveis, portanto não deve ser antecipada.

## Decisões recomendadas para execução

As decisões abaixo ficam registradas como orientação inicial para a execução. Podem ser revistas caso as aplicações consumidoras apresentem uma restrição de compatibilidade não identificada no repositório.

### 1. Autorização

**Decisão recomendada:** a camada HTTP deve consultar a autorização atual em cada requisição, preferencialmente através de um `AuthorizationProvider` (`() => Authorization`), em vez de guardar um objeto de autorização capturado no construtor.

**Motivo:** o refresh de sessão pode substituir o objeto ou o token. Consultar a autorização no momento da requisição evita retry com credencial obsoleta.

**Consequências:**

- preservar `handleUnauthorizedAccess()` como mecanismo de renovação;
- permitir somente um retry automático após `401`;
- adicionar testes para token antigo, token renovado e segundo `401`;
- manter compatibilidade temporária caso consumidores ainda forneçam o contrato atual.

**Fase afetada:** F1 — Autorização e camada HTTP.

### 2. Compatibilidade dos eventos públicos

**Decisão recomendada:** preservar os nomes atuais dos eventos públicos nesta etapa. A mudança inicial deve tratar tipagem, documentação e testes, sem renomear eventos.

**Motivo:** aplicações consumidoras podem depender diretamente de nomes como `novaNotificacao`, `conteudoSinalizado` e `opcaoMenuSelecionada`. Renomeá-los quebraria integrações sem garantia de detecção pelo compilador.

**Consequências:**

- manter os eventos existentes como contratos compatíveis;
- centralizar payloads compartilhados em `src/global/`;
- eliminar `any` dos eventos públicos gradualmente;
- somente criar aliases ou novos nomes em uma versão futura, com estratégia de depreciação.

**Fase afetada:** F3 — Eventos e contratos públicos.

### 3. Configuração de endpoints

**Decisão recomendada:** manter o modelo híbrido. Propriedades explícitas terão prioridade, e `window.___bth` continuará como fallback de compatibilidade, mas todo acesso será centralizado em um resolvedor.

**Precedência definida:**

1. endpoint ou URL informado explicitamente no componente;
2. endpoint equivalente encontrado em `window.___bth.envs.suite`;
3. estado de configuração indisponível, com comportamento documentado.

**Motivo:** essa opção reduz a duplicação sem quebrar aplicações atuais que dependem do `env.js`.

**Consequências:**

- preservar suporte ao ambiente atual da plataforma;
- facilitar testes sem depender diretamente de `window`;
- permitir adoção explícita por aplicações novas;
- deixar uma eventual remoção do fallback global para uma versão major futura.

**Fase afetada:** F2 — Configuração de ambiente e endpoints.

### 4. Estratégia de testes

**Decisão recomendada:** migrar unitários e testes de componentes para Vitest, preferencialmente através de `@stencil/vitest`, e migrar fluxos de navegador para Playwright.

**Motivo:** o runner integrado atual do Stencil está deprecated. A separação permite usar uma ferramenta adequada para cada tipo de teste, mantendo testes rápidos para regras e serviços e navegador real para E2E, Shadow DOM, foco, WebSocket e acessibilidade.

**Estratégia de migração:**

1. criar a nova configuração em paralelo;
2. migrar primeiro `utils`, `global/api` e serviços;
3. migrar componentes simples;
4. migrar componentes com eventos, slots e Shadow DOM;
5. migrar E2E e acessibilidade para Playwright;
6. comparar cobertura e resultados;
7. remover o runner antigo somente após equivalência comprovada.

**Fase afetada:** F7 — Migração do runner de testes.

### 5. Escopo de acessibilidade

**Decisão recomendada:** incluir correções de acessibilidade diretamente relacionadas às alterações arquiteturais, mas manter uma frente própria para a auditoria WCAG completa.

**Será obrigatório nas fases de alteração:**

- preservar operação por teclado;
- preservar foco visível;
- manter nomes e estados ARIA;
- corrigir controles afetados pela mudança;
- adicionar ou atualizar testes de acessibilidade dos componentes alterados.

**Ficará em frente própria:**

- contraste AAA completo;
- tamanho mínimo de alvos;
- hierarquia global de títulos;
- idioma, abreviações e nível de leitura;
- hover, temporizadores e interrupções não diretamente envolvidos na tarefa.

**Motivo:** evita misturar toda a auditoria visual e semântica ao trabalho de arquitetura, sem permitir que as refatorações introduzam regressões de acessibilidade.

**Fases afetadas:** todas as fases que alterarem interface, eventos de interação ou ciclo de vida; auditoria completa registrada como backlog separado.

### 6. Versionamento do pacote

**Decisão recomendada:** classificar cada fase antes de iniciá-la, conforme a coluna de impacto da tabela de acompanhamento, e publicar as mudanças de comportamento observável como `minor`, nunca embutidas em um `patch`.

**Classificação inicial:**

- `patch`: H1 e F6, que corrigem comportamento defeituoso ou reorganizam código sem alterar contrato;
- `minor`: F1, F2, F3, F4 e F5, que alteram comportamento observável, ainda que de forma compatível;
- sem impacto de versão: F0 e F7, restritos a diagnóstico e infraestrutura de testes;
- `major`: reservado para renomear eventos ou remover o fallback `window.___bth`, fora do escopo deste plano.

**Motivo:** o pacote está em `2.0.0` e é consumido por outras aplicações. F1 muda o comportamento do retry e F2 muda a precedência de resolução de endpoints, e ambos são perceptíveis por quem consome.

**Fases afetadas:** todas.

### 7. Rede de regressão visual

**Decisão recomendada:** usar `yarn test.screenshot` como rede de segurança das fases que prometem ausência de mudança visual, com baseline capturado em F0.

**Motivo:** F6 estabelece que o HTML público não deve mudar, sem instrumento para comprovar. O repositório já possui o comando, então o custo é apenas registrar o baseline e comparar.

**Consequências:**

- gerar e versionar o baseline em F0;
- comparar em F6 e antes do fechamento em F8;
- registrar como justificativa qualquer diferença aceita.

**Fases afetadas:** F0, F6 e F8.

## Confirmações ainda necessárias antes da implementação

- [ ] Confirmar com a aplicação consumidora se o refresh substitui o objeto de autorização ou apenas altera seu token.
- [ ] Confirmar que eventos públicos devem permanecer com os nomes atuais.
- [ ] Confirmar que o fallback `window.___bth` deve continuar suportado nesta versão.
- [ ] Confirmar disponibilidade de adoção de Vitest e Playwright no CI.
- [ ] Confirmar se a auditoria WCAG completa será acompanhada em outro ticket ou documento.
- [ ] Confirmar a classificação de versão proposta na decisão 6 com quem publica o pacote.
- [ ] Confirmar onde o baseline de screenshots será versionado e quem aprova diferenças.
- [ ] Confirmar se o corpo de requisição em `Api` entra no escopo de F1.4 ou fica como pendência.

## Registro de execução

| Data | Fase/tarefa | Resultado | Commit/observação |
| --- | --- | --- | --- |
| 2026-09-18 | Criação do plano | Plano salvo | `docs/plano-execucao-arquitetura-frontend.md` |
| 2026-09-18 | Revisão do plano contra o código | Plano atualizado com H1, F1.4, decisões 6 e 7, dependência F5 para F6 e correções de F4.1 | `docs/plano-execucao-arquitetura-frontend.md` |
| 2026-09-18 | Descarte das alterações não commitadas | Árvore de trabalho retornada ao commit `123ccfb`; protótipo de mock removido e especificado como F9 | `docs/plano-execucao-arquitetura-frontend.md` |
