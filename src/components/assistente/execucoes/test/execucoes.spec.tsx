import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { getMockAuthorization } from '../../../../global/test/helper/api.helper';
import { API_HOST, execucoesMock, conclusaoMock } from './helper/execucoes.helper';
import { BthExecucoes } from '../execucoes';
import { ExecucoesService } from '../execucoes.service';

function getAuthorization(page: SpecPage) {
  let execucoesElement: HTMLBthExecucoesElement = page.body.querySelector('bth-execucoes');
  execucoesElement.authorization = getMockAuthorization();
}

function getSpyOn() {
  jest.spyOn(BthExecucoes.prototype, 'onChangeApiRelatedProperties').mockImplementation(function() {
    this.inicializarServices();
    this.getExecucoes();
  });

  jest.spyOn(ExecucoesService.prototype, 'execucoesUsuario').mockResolvedValue(JSON.parse(JSON.stringify(execucoesMock)));
  jest.spyOn(ExecucoesService.prototype, 'getConclusao').mockResolvedValue(conclusaoMock);

}

describe('bth-execucoes', () => {

  let page: SpecPage;
  const PROPS = `execucoes-api="${API_HOST}" assinador-api="${API_HOST}" consulta-api="${API_HOST}"`;

  beforeEach(async () => {
    getSpyOn();

    page = await newSpecPage({
      components: [BthExecucoes],
    });

  });

  afterEach(async () => {
    // Garante que os ciclos de vidas serão chamados
    await page.setContent('');
    jest.restoreAllMocks();
  });

  it('deve renderizar corretamente', async () => {
    await page.setContent('<bth-execucoes></bth-execucoes>');
    await page.waitForChanges();

    expect(page.root).not.toBeNull();
    expect(page.root).toEqualLightHtml('<bth-execucoes></bth-execucoes>');
  });



  it('exibe texto de indisponibilidade se authorization não for informado', async () => {
    // Act
    await page.setContent(`<bth-execucoes ${PROPS}></bth-execucoes>`);

    // Assert
    const execucoesElement: HTMLBthNovidadesElement = page.body.querySelector('bth-execucoes');

    expect(execucoesElement.authorization).toBeUndefined();
    expect(execucoesElement.shadowRoot.textContent).toMatch(/As execuções estão temporariamente indisponível/);
  });

  it('deve processar execucoes corretamente', async () => {
    // Arrange
    await page.setContent(`<bth-execucoes ${PROPS}></bth-execucoes>`);
    const component = page.rootInstance as BthExecucoes;
    getAuthorization(page);

    // Act
    await page.waitForChanges();

    // Assert
    expect(component.execucoes).toEqual(execucoesMock.content);
    expect(component.isApiIndisponivel).toBe(false);
  });

  it('Deve buscar a mensagem de erro da conclusao', async () => {
    // Arrange
    await page.setContent(`<bth-execucoes ${PROPS}></bth-execucoes>`);
    const component = page.rootInstance as BthExecucoes;
    getAuthorization(page);

    // Act
    await page.waitForChanges();
    let element: HTMLBthExecucoesElement = page.body.querySelector('bth-execucoes');
    element.dispatchEvent(new CustomEvent('errorClicked', { detail: { identificador: '1' } }));
    await page.waitForChanges();

    // Assert
    expect(component.execucoes).toEqual([
      { id: '1', autor: 'john.green', mensagemConclusao: 'erro teste'},
      { id: '2', autor: 'julia.brown' }
    ]);
  });

  it('deve modificar execucoesUsuario para false ao clicar em "Todas"', async () => {
    // Arrange
    await page.setContent(`<bth-execucoes ${PROPS}></bth-execucoes>`);
    getAuthorization(page);
    const component = page.rootInstance as BthExecucoes;
    const element: HTMLBthExecucoesElement = page.rootInstance;

    await page.waitForChanges();

    // Ativar o mock das funções privadas para simplificar os testes
    jest.spyOn(element as any, 'resetPagination'); // Usar any para funções privadas
    jest.spyOn(element as any, 'getExecucoes');

    // Act
    const buttonAll = page.root.shadowRoot.querySelector('.btn-all') as HTMLButtonElement;
    buttonAll.click();
    await page.waitForChanges();

    // Assert
    expect(component.execucoesUsuario).toBe(false);
    expect((element as any).resetPagination).toHaveBeenCalled();
    expect((element as any).getExecucoes).toHaveBeenCalled();
  });

  it('deve modificar execucoesUsuario para true ao clicar em "Todas"', async () => {
    // Arrange
    await page.setContent(`<bth-execucoes ${PROPS}></bth-execucoes>`);
    getAuthorization(page);
    const component = page.rootInstance as BthExecucoes;
    const element: HTMLBthExecucoesElement = page.rootInstance;

    await page.waitForChanges();

    // Ativar o mock das funções privadas para simplificar os testes
    jest.spyOn(element as any, 'resetPagination'); // Usar any para funções privadas
    jest.spyOn(element as any, 'getExecucoes');

    // Act
    const buttonAll = page.root.shadowRoot.querySelector('.btn-user') as HTMLButtonElement;
    buttonAll.click();
    await page.waitForChanges();

    // Assert
    expect(component.execucoesUsuario).toBe(true);
    expect((element as any).resetPagination).toHaveBeenCalled();
    expect((element as any).getExecucoes).toHaveBeenCalled();
  });

});
