import { setupTestingEnvs, setupFetchMock, setFetchMockData, setFetchMockStatus } from '../../../../test/utils/spec.helper';
import { getMockAuthorization } from '../../../global/test/helper/api.helper';
import { AssistenteService } from '../assistente.service';

describe('notificacoes service', () => {
  const host = 'https://api.extensoes.betha.cloud';
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

  it('extensões : deve buscar de 0 à 20', async () => {
    const service = new AssistenteService(authorization, host);

    await service.extensoes({filter: '', limit:20, offset: 0, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/extensao?filter=&limit=20&offset=0&sort=`, getExpectedAuthorizationHeaders('GET'));
  });
  
  it('extensões : deve buscar de 20 à 40', async () => {
    const service = new AssistenteService(authorization, host);

    await service.extensoes({filter: '', limit:40, offset: 20, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/extensao?filter=&limit=40&offset=20&sort=`, getExpectedAuthorizationHeaders('GET'));
  });

  it('tags/relatórios : deve buscar de 0 à 20', async () => {
    const service = new AssistenteService(authorization, host);

    await service.tags({filter: 'RELATORIOS', limit:20, offset: 0, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/tag/RELATORIOS?limit=20&offset=0&sort=`, getExpectedAuthorizationHeaders('GET'));
  });
  
  it('tags/scripts : deve buscar de 0 à 20', async () => {
    const service = new AssistenteService(authorization, host);

    await service.tags({filter: 'SCRIPTS', limit:20, offset: 0, sort: ''});

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/tag/SCRIPTS?limit=20&offset=0&sort=`, getExpectedAuthorizationHeaders('GET'));
  });

  it('adicionar extensão como favorito', async () => {
    const service = new AssistenteService(authorization, host);

    await service.favorito('RELATORIO','112233', false);

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/extensao/RELATORIO/112233/favoritos`, getExpectedAuthorizationHeaders('PUT'));
  });
  
  it('remover extensão como favorito', async () => {
    const service = new AssistenteService(authorization, host);

    await service.favorito('RELATORIO','112233', true);

    expect(fetchMock)
      .toBeCalledWith(`${host}/api/extensao/RELATORIO/112233/favoritos`, getExpectedAuthorizationHeaders('DELETE'));
  });

  it('execuções/minhas : deve buscar de 0 à 20', async () => {
    const service = new AssistenteService(authorization, host);

    await service.execucoesUsuario('minhas');

    expect(fetchMock)
      .toBeCalledWith(`${host}/v1/api/execucoes/f4/minhas?filter=minhas&limit=20&offset=0`, getExpectedAuthorizationHeaders('GET'));
  });
  
  it('execuções/todas : deve buscar de 0 à 20', async () => {
    const service = new AssistenteService(authorization, host);

    await service.execucoes('todas');

    expect(fetchMock)
      .toBeCalledWith(`${host}/v1/api/execucoes/f4?filter=todas&limit=20&offset=0`, getExpectedAuthorizationHeaders('GET'));
  });

});
