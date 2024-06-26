import { Api } from '../../global/api';
import { AuthorizationConfig } from '../../global/interfaces';
import { PaginationParams } from './assistente.interfaces';

export class AssistenteService {

  private api: Api;

  constructor(authorization: AuthorizationConfig, assistenteApi: string) {
    this.api = new Api(authorization.getAuthorization(), authorization.handleUnauthorizedAccess, assistenteApi);
  }

  async extensoes(params: PaginationParams): Promise<any> {
    return this.api.request('GET', `api/extensao?filter=${params.filter}&limit=${params.limit}&offset=${params.offset}&sort=${params.sort}`)
      .then(res => res.json());
  }
  
  async tags(params: PaginationParams): Promise<any> {
    return this.api.request('GET', `api/tag/${params.filter}?limit=${params.limit}&offset=${params.offset}&sort=${params.sort}`)
      .then(res => res.json());
  }
  
  async favorito(tipo: string, id: string, favorito: boolean ): Promise<any> {
    const method = favorito ? 'DELETE' : 'PUT';
    return this.api.request(method, `api/extensao/${tipo}/${id}/favoritos`);
  }

  async execucoes(filter: string, params: PaginationParams): Promise<any> {
    return this.api.request('GET', `v1/api/execucoes/f4?filter=${filter}&limit=${params.limit}&offset=${params.offset}`)
      .then(res => res.json());
  }

  async execucoesUsuario(filter: string, params: PaginationParams): Promise<any> {
    return this.api.request('GET', `v1/api/execucoes/f4/minhas?filter=${filter}&limit=${params.limit}&offset=${params.offset}`)
      .then(res => res.json());
  }

}
