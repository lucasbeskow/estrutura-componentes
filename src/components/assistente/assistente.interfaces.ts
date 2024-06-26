export interface PaginationParams {
    offset?: number;
    limit?: number;
    sort?: string;
    filter?: string;
}

export enum TipoExtensao {
    all = 'ALL', relatorio = 'RELATORIO', script = 'SCRIPT', favoritos = 'FAVORITOS'
}

export enum TipoVisualizacao {
    lista = 'LISTA', pasta = 'PASTA'
}

export interface PropFiltro {
    filtro: string,
    valor: string
}

export interface OpcaoFiltro {
    id: TipoExtensao | TipoVisualizacao,
    ativo?: boolean,
    icone: string,
    descricao: string
}

export interface Extensao {
    id: string
    titulo: string
    tipo: string
    descricao: string
    natureza: any
    tags: Tag[]
    atributos: Atributo[]
    propriedades: Propriedade[]
    eventos: any[]
    referencia: Referencia
    flexibilizacao: any
    favorita: boolean
    disponivel: boolean
    criadoEm: string
    criadoPor: string
    atualizadoEm: string
    atualizadoPor: string
    contexto: Contexto
    licenca: Licenca
    icone: string
}

export interface Tag {
    rotulo: string
    compartilhado: boolean
    ativo: boolean
}

export interface Atributo {
    chave: string
    valor: string
    compartilhado: boolean
}

export interface Propriedade {
    chave: string
    valor: string
}

export interface Referencia {
    id: string
    revisao: string
    versao: number
}

export interface Contexto {
    entidade: number
    database: number
    sistema: number
    complete: boolean
}

export interface Licenca {
    modelo: string
    permitirVisualizarFonte: boolean
    permitirCopiar: boolean
}
