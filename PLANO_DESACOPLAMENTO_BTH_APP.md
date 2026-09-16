# Plano Priorizado de Desacoplamento de `bth-app`

## Resumo

Aplicar o desacoplamento em quatro frentes, nesta ordem: contratos compartilhados, fronteiras estruturais do shell, tema visual e guardrails para evitar regressão. O foco é reduzir dependências explícitas de `src/components/app/*` sem quebrar tags, nomes de eventos ou comportamento atual.

## Prioridades

### P0. Contratos e eventos compartilhados

- Extrair `ConteudoSinalizadoEvent`, `PainelLateralShowEvent` e `MenuBannerAlteradoEvent` para um módulo neutro fora de `app/`.
- Centralizar nomes de eventos do shell como contratos compartilhados.
- Eliminar imports de `app.interfaces` fora de `src/components/app/`.

### P1. Acoplamento estrutural do shell

- Tratar `bth-menu-ferramenta` e `bth-menu-painel-lateral` como a superfície estrutural reutilizável do shell.
- Manter `bth-menu-horizontal-item` e `bth-menu-vertical-item` como internos do núcleo.
- Reposicionar `bth-marca-produto` e os componentes de ferramentas como recomendados para o shell, mas não exclusivos dele.

### P2. Acoplamento visual

- Introduzir tokens genéricos `--bth-*`.
- Manter `--bth-app-*` como compatibilidade legada.
- Migrar primeiro os componentes fora de `app/` para os novos tokens.

### P3. Governança

- Bloquear por lint novos imports relativos para `components/app/**` fora do próprio pacote `app`.
- Atualizar a documentação para refletir os novos limites entre shell, contrato e componentes reutilizáveis.

## Critérios de aceite

- Nenhum componente fora de `src/components/app/` depende de tipos definidos em `app.interfaces`.
- Componentes fora de `app/` aceitam tokens `--bth-*`.
- O shell continua reagindo aos mesmos nomes de eventos e payloads.
- `yarn lint`, specs e build passam no ambiente local; falhas de e2e devem ser tratadas separadamente se forem ambientais.
