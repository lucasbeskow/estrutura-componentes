export interface PaginationParams {
    offset?: number;
    limit?: number;
    filter?: string;
}

export enum TipoExecucao {
    minhas = 'MINHAS', todas = 'TODAS'
}

export interface OpcaoFiltro {
    id: TipoExecucao,
    ativo?: boolean,
    icone: string,
    descricao: string
}