import { Api } from '../../../global/api';
import { AuthorizationConfig } from '../../../global/interfaces';
import { PaginationParams } from '../assistente.interfaces';

export class ExecucoesService {

  private api: Api;

  constructor(authorization: AuthorizationConfig, execucoesApi: string) {
    this.api = new Api(authorization.getAuthorization(), authorization.handleUnauthorizedAccess, execucoesApi);
  }

  async execucoes(params: PaginationParams = { offset: 0, limit: 10 }): Promise<any> {
    return this.api.request('GET', `api/execucoes/f4?filter=${params.filter}&limit=${params.limit}&offset=${params.offset}`)
      .then(res => res.json());
  }

  async execucoesUsuario(params: PaginationParams = { offset: 0, limit: 10 }): Promise<any> {
    return this.api.request('GET', `api/execucoes/f4/minhas?filter=${params.filter}&limit=${params.limit}&offset=${params.offset}`)
      .then(res => res.json());
  }

  async getConclusao(execucaoId: string) {
    return this.api.request('GET', `api/execucoes/${execucaoId}/conclusao`)
      .then(res => res.json());
  }

}
