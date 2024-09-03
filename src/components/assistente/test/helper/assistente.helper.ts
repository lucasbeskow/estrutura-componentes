export const API_HOST = 'https://api.extensoes.betha.cloud';

export const tagsMock = {
  content: [
    { rotulo: 'Tag 1', compartilhado: false, ativo: false },
    { rotulo: 'Tag 2', compartilhado: false, ativo: true },
    { rotulo: 'Tag 3', compartilhado: false, ativo: false }
  ],
  hasNext: false
};

export const extensoesMock = {
  content: [
    { id: '1', titulo: 'Extensao 1', tipo: 'tipo', favorita: false, tags: [], referencia: {id: 1} },
    { id: '2', titulo: 'Extensao 2', tipo: 'tipo', favorita: true, tags: [], referencia: {id: 2} }
  ],
  hasNext: false
};
