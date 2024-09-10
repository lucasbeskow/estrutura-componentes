import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { getMockAuthorization } from '../../../global/test/helper/api.helper';
import { BthAssistente } from '../assistente';
import { TipoExtensao, TipoVisualizacao } from '../assistente.interfaces';
import { AssistenteService } from '../assistente.service';
import { API_HOST, tagsMock, extensoesMock } from './helper/assistente.helper';

function getAuthorization(page: SpecPage) {
  let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
  assistente.authorization = getMockAuthorization();
}

function getSpyOn() {
  jest.spyOn(BthAssistente.prototype, 'onChangeApiRelatedProperties').mockImplementation(function() {
    this.inicializarServices();
    this.loadFiltros();
  });
  jest.spyOn(AssistenteService.prototype, 'tags').mockResolvedValue(JSON.parse(JSON.stringify(tagsMock)));
  jest.spyOn(AssistenteService.prototype, 'extensoes').mockResolvedValue(JSON.parse(JSON.stringify(extensoesMock)));

  jest.spyOn(AssistenteService.prototype, 'favorito').mockImplementation(async function() {
    return Promise.resolve();
  });
}


describe('BthAssistente', () => {
  let page: SpecPage;

  beforeEach(async () => {
    getSpyOn();

    page = await newSpecPage({
      components: [BthAssistente],
    });

  });

  afterEach(async () => {
    // Garante que os ciclos de vidas serão chamados
    await page.setContent('');
    jest.restoreAllMocks();
  });


  it('deve renderizar corretamente', async () => {
    await page.setContent('<bth-assistente></bth-assistente>');
    await page.waitForChanges();

    expect(page.root).not.toBeNull();
    expect(page.root).toEqualLightHtml('<bth-assistente></bth-assistente>');
  });


  it('exibe texto de indisponibilidade se authorization não for informado', async () => {
    // Act
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);

    // Assert
    const assistente: HTMLBthNovidadesElement = page.body.querySelector('bth-assistente');

    expect(assistente.authorization).toBeUndefined();
    expect(assistente.shadowRoot.textContent).toMatch(/O assistente está temporariamente indisponível/);
  });


  it('deve processar tags corretamente', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    const component = page.rootInstance as BthAssistente;
    getAuthorization(page);

    // Act
    await page.waitForChanges();

    // Assert
    expect(component.tags).toEqual(tagsMock.content);
    expect(component.isApiIndisponivel).toBe(false);
  });


  it('deve processar extensoes corretamente', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    const component = page.rootInstance as BthAssistente;
    getAuthorization(page);

    // Act
    await page.waitForChanges();

    // Assert
    expect(component['extensoes']).toEqual(extensoesMock.content);
    expect(component.isApiIndisponivel).toBe(false);
  });


  it('deve retornar indisponivel ao processar extensoes', async () => {
    // Arrange
    jest.spyOn(AssistenteService.prototype, 'extensoes').mockImplementation(async function() {
      return Promise.reject(new Error('Erro interno no servidor'));
    });
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    const component = page.rootInstance as BthAssistente;
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    getAuthorization(page);

    // Act
    await page.waitForChanges();

    // Assert
    expect(assistente.assistenteApi).toEqual(API_HOST);
    expect(assistente.authorization).toBeDefined();
    expect(component.isApiIndisponivel).toBe(true);
    expect(assistente.shadowRoot.textContent).toMatch(/O assistente está temporariamente indisponível/);
  });

  it('deve retornar indisponivel ao processar tags', async () => {
    // Arrange
    jest.spyOn(AssistenteService.prototype, 'tags').mockImplementation(async function() {
      return Promise.reject(new Error('Erro interno no servidor'));
    });
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    const component = page.rootInstance as BthAssistente;
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    getAuthorization(page);

    // Act
    await page.waitForChanges();

    // Assert
    expect(assistente.assistenteApi).toEqual(API_HOST);
    expect(assistente.authorization).toBeDefined();
    expect(component.isApiIndisponivel).toBe(true);
    expect(assistente.shadowRoot.textContent).toMatch(/O assistente está temporariamente indisponível/);
  });


  it('deve ativar a tag com o rótulo fornecido e desativar as outras', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    getAuthorization(page);
    const component = page.rootInstance as BthAssistente;

    // Act
    await page.waitForChanges();
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.dispatchEvent(new CustomEvent('tagClicked', { detail: { identificador: 'Tag 1' } }));

    // Assert
    expect(component.tags).toEqual([
      { rotulo: 'Tag 1', compartilhado: false, ativo: true },
      { rotulo: 'Tag 2', compartilhado: false, ativo: false },
      { rotulo: 'Tag 3', compartilhado: false, ativo: false }
    ]);
  });


  it('deve desativar a tag caso seja selecionado uma tag ativa', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    getAuthorization(page);
    const component = page.rootInstance as BthAssistente;

    // Act
    await page.waitForChanges();
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.dispatchEvent(new CustomEvent('tagClicked', { detail: { identificador: 'Tag 2' } }));

    // Assert
    expect(component.tags).toEqual([
      { rotulo: 'Tag 1', compartilhado: false, ativo: false },
      { rotulo: 'Tag 2', compartilhado: false, ativo: false },
      { rotulo: 'Tag 3', compartilhado: false, ativo: false }
    ]);
  });


  it('define relatorio conforme recebido por evento "navbarPillItemClicked"', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.authorization = getMockAuthorization();

    // Act
    assistente.dispatchEvent(new CustomEvent('navbarPillItemClicked', { detail: { identificador: TipoExtensao.relatorio.toString() } }));

    // Assert
    assistente = page.body.querySelector('bth-assistente');
    const navbarPillItemAtivo: HTMLBthNavbarPillItemElement = assistente.shadowRoot.querySelector('bth-navbar-pill-item[ativo]');
    expect(navbarPillItemAtivo.getAttribute('identificador')).toMatch(TipoExtensao.relatorio.toString());
  });


  it('define script conforme recebido por evento "navbarPillItemClicked"', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.authorization = getMockAuthorization();

    // Act
    assistente.dispatchEvent(new CustomEvent('navbarPillItemClicked', { detail: { identificador: TipoExtensao.script.toString() } }));
    await page.waitForChanges();

    // Assert
    assistente = page.body.querySelector('bth-assistente');
    const navbarPillItemAtivo: HTMLBthNavbarPillItemElement = assistente.shadowRoot.querySelector('bth-navbar-pill-item[ativo]');
    expect(navbarPillItemAtivo.getAttribute('identificador')).toMatch(TipoExtensao.script.toString());
  });



  it('define todos conforme recebido por evento "navbarPillItemClicked"', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.authorization = getMockAuthorization();

    // Act
    assistente.dispatchEvent(new CustomEvent('navbarPillItemClicked', { detail: { identificador: TipoExtensao.all.toString() } }));
    await page.waitForChanges();

    // Assert
    assistente = page.body.querySelector('bth-assistente');
    const navbarPillItemAtivo: HTMLBthNavbarPillItemElement = assistente.shadowRoot.querySelector('bth-navbar-pill-item[ativo]');
    expect(navbarPillItemAtivo.getAttribute('identificador')).toMatch(TipoExtensao.all.toString());
  });


  it('define lista conforme recebido por evento "navbarPillItemClicked"', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.authorization = getMockAuthorization();
    const component = page.rootInstance as BthAssistente;

    // Act
    assistente.dispatchEvent(new CustomEvent('navbarPillItemClicked', { detail: { identificador: TipoVisualizacao.lista.toString() } }));
    await page.waitForChanges();
    const tipoVisualizacaoAtiva = component.visualizacao.find((tipo) => tipo.ativo == true);

    // Assert
    expect(tipoVisualizacaoAtiva.id).toMatch(TipoVisualizacao.lista.toString());
    expect(tipoVisualizacaoAtiva.ativo).toBe(true);
  });


  it('define pasta conforme recebido por evento "navbarPillItemClicked"', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.authorization = getMockAuthorization();
    const component = page.rootInstance as BthAssistente;

    // Act
    assistente.dispatchEvent(new CustomEvent('navbarPillItemClicked', { detail: { identificador: TipoVisualizacao.pasta.toString() } }));
    await page.waitForChanges();
    const tipoVisualizacaoAtiva = component.visualizacao.find((tipo) => tipo.ativo == true);

    // Assert
    expect(tipoVisualizacaoAtiva.id).toMatch(TipoVisualizacao.pasta.toString());
    expect(tipoVisualizacaoAtiva.ativo).toBe(true);
  });


  it('deve favoritar extensão corretamente', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    getAuthorization(page);
    const component = page.rootInstance as BthAssistente;
    await page.waitForChanges();

    // Act
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.dispatchEvent(new CustomEvent('favClicked', { detail: { identificador: '1' } }));
    await page.waitForChanges();

    // Assert
    expect(component.extensoes).toEqual([
      { id: '1', titulo: 'Extensao 1', tipo: 'tipo', favorita: true, tags: [], referencia: {id: 1} },
      { id: '2', titulo: 'Extensao 2', tipo: 'tipo', favorita: true, tags: [], referencia: {id: 2} }
    ]);
  });


  it('deve desfavoritar extensão corretamente', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    getAuthorization(page);
    const component = page.rootInstance as BthAssistente;
    await page.waitForChanges();

    // Act
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.dispatchEvent(new CustomEvent('favClicked', { detail: { identificador: '2' } }));
    await page.waitForChanges();

    // Assert
    expect(component.extensoes).toEqual([
      { id: '1', titulo: 'Extensao 1', tipo: 'tipo', favorita: false, tags: [], referencia: {id: 1} },
      { id: '2', titulo: 'Extensao 2', tipo: 'tipo', favorita: false, tags: [], referencia: {id: 2} }
    ]);
  });


  it('deve retornar erro ao favoritar', async () => {
    // Arrange
    jest.spyOn(AssistenteService.prototype, 'favorito').mockImplementation(async function() {
      return Promise.reject(new Error('Erro interno no servidor'));
    });
    const consoleSpy = jest.spyOn(console, 'log');

    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    getAuthorization(page);
    await page.waitForChanges();

    // Act
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.dispatchEvent(new CustomEvent('favClicked', { detail: { identificador: '2' } }));
    await page.waitForChanges();

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao favoritar');
  });


  it('deve desfavoritar extensão corretamente', async () => {
    // Arrange
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    getAuthorization(page);
    const component = page.rootInstance as BthAssistente;
    await page.waitForChanges();

    // Act
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.dispatchEvent(new CustomEvent('buscaSubmit', { detail: { termo: 'Extensao 1' } }));
    await page.waitForChanges();

    // Assert
    expect(component.termoBusca).toEqual('Extensao 1');
  });


  it('deve exibir todas as tags', async () => {
    // Arrange
    const tagsMockHasNext = JSON.parse(JSON.stringify(tagsMock));
    tagsMockHasNext.hasNext = true;
    const tagsSpy = jest.spyOn(AssistenteService.prototype, 'tags').mockResolvedValue(tagsMockHasNext);
    await page.setContent(`<bth-assistente assistente-api="${API_HOST}"></bth-assistente>`);
    getAuthorization(page);

    // Act
    await page.waitForChanges();
    let assistente: HTMLBthAssistenteElement = page.body.querySelector('bth-assistente');
    assistente.dispatchEvent(new CustomEvent('tagClicked', { detail: { identificador: 'Ver todas as tags' } }));
    await page.waitForChanges();
    // Assert

    expect(tagsSpy).toHaveBeenCalledWith(expect.objectContaining({
      limit: 999
    }));
  });


});
