import { setupTestingEnvs, setupFetchMock, setFetchMockData, setFetchMockStatus } from '../../../../../test/utils/spec.helper';

import { getMockAuthorization } from '../../../../global/test/helper/api.helper';
import { ExecucoesService } from '../execucoes.service';

describe('execucoes service', () => {

  const host = 'https://api.execucoes.betha.cloud';
  const authorization = getMockAuthorization();
  let fetchMock;

  beforeEach(() => {
    setupTestingEnvs();

    fetchMock = setupFetchMock();
    setFetchMockData({ content: [] });
    setFetchMockStatus(200);
  });

  function getExpectedAuthorizationHeaders(method: string = 'GET') {
    return {
      method: method,
      headers: { '_values': [['Authorization', `bearer ${authorization.getAuthorization().accessToken}`]] }
    };
  }

  it('execuções/minhas : deve buscar de 0 à 10', async () => {
    const service = new ExecucoesService(authorization, host);

    await service.execucoesUsuario({filter: '', limit:10, offset: 0, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/execucoes/f4/minhas?filter=&limit=10&offset=0`, getExpectedAuthorizationHeaders('GET'));
  });

  it('execuções/todas : deve buscar de 0 à 10', async () => {
    const service = new ExecucoesService(authorization, host);

    await service.execucoes({filter: '', limit:10, offset: 0, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/execucoes/f4?filter=&limit=10&offset=0`, getExpectedAuthorizationHeaders('GET'));
  });

  it('execuções/minhas : deve buscar de 10 à 20', async () => {
    const service = new ExecucoesService(authorization, host);

    await service.execucoesUsuario({filter: '', limit:20, offset: 10, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/execucoes/f4/minhas?filter=&limit=20&offset=10`, getExpectedAuthorizationHeaders('GET'));
  });

  it('execuções/todas : deve buscar de 10 à 20', async () => {
    const service = new ExecucoesService(authorization, host);

    await service.execucoes({filter: '', limit:20, offset: 10, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/execucoes/f4?filter=&limit=20&offset=10`, getExpectedAuthorizationHeaders('GET'));
  });

  it('deve buscar a conclusao', async () => {
    const service = new ExecucoesService(authorization, host);

    await service.getConclusao('123');

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/execucoes/123/conclusao`, getExpectedAuthorizationHeaders('GET'));
  });


});
