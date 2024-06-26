# bth-assistente-item



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute       | Description   | Type      | Default     |
| --------------- | --------------- | ------------- | --------- | ----------- |
| `descricao`     | `descricao`     | Descrição     | `string`  | `undefined` |
| `favorito`      | `favorito`      | Favorito      | `boolean` | `undefined` |
| `icone`         | `icone`         | Ícone         | `string`  | `undefined` |
| `identificador` | `identificador` | Identificador | `string`  | `undefined` |
| `tags`          | --              | Tags          | `Tag[]`   | `[]`        |


## Dependencies

### Used by

 - [bth-assistente](..)

### Depends on

- [bth-assistente-fav](../assistente-fav)
- [bth-icone](../../comuns/icone)
- [bth-assistente-tag](../assistente-tag)

### Graph
```mermaid
graph TD;
  bth-assistente-item --> bth-assistente-fav
  bth-assistente-item --> bth-icone
  bth-assistente-item --> bth-assistente-tag
  bth-assistente-fav --> bth-icone
  bth-assistente-tag --> bth-icone
  bth-assistente --> bth-assistente-item
  style bth-assistente-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

Esta documentação é gerada automáticamente pelo StencilJS =)
