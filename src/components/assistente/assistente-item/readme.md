# bth-assistente-item



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute       | Description                                                                                                         | Type                  | Default     |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `authorization` | --              | Configuração de autorização. É necessária para o componente de execucoes poder realizar autentizar com os serviços. | `AuthorizationConfig` | `undefined` |
| `descricao`     | `descricao`     | Descrição                                                                                                           | `string`              | `undefined` |
| `extensaoId`    | `extensao-id`   | Identificador da extensão                                                                                           | `string`              | `undefined` |
| `favorito`      | `favorito`      | Favorito                                                                                                            | `boolean`             | `undefined` |
| `icone`         | `icone`         | Ícone                                                                                                               | `string`              | `undefined` |
| `identificador` | `identificador` | Identificador                                                                                                       | `string`              | `undefined` |
| `tags`          | --              | Tags                                                                                                                | `Tag[]`               | `[]`        |


## Dependencies

### Used by

 - [bth-assistente](..)

### Depends on

- [bth-assistente-fav](../assistente-fav)
- [bth-icone](../../comuns/icone)
- [bth-assistente-tag](../assistente-tag)
- [bth-execucoes](../execucoes)

### Graph
```mermaid
graph TD;
  bth-assistente-item --> bth-assistente-fav
  bth-assistente-item --> bth-icone
  bth-assistente-item --> bth-assistente-tag
  bth-assistente-item --> bth-execucoes
  bth-assistente-fav --> bth-icone
  bth-assistente-tag --> bth-icone
  bth-execucoes --> bth-execucoes-item
  bth-execucoes --> bth-icone
  bth-execucoes --> bth-loader
  bth-execucoes-item --> bth-execucoes-status
  bth-execucoes-item --> bth-icone
  bth-execucoes-item --> bth-execucoes-download
  bth-execucoes-status --> bth-icone
  bth-execucoes-download --> bth-icone
  bth-execucoes-download --> bth-popover
  bth-popover --> bth-icone
  bth-popover --> bth-loader
  bth-assistente --> bth-assistente-item
  style bth-assistente-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

Esta documentação é gerada automáticamente pelo StencilJS =)
