import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthExecucoesDownload } from '../execucoes-download';

describe('brh-execucoes-download', () => {

  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthExecucoesDownload] });
  });


  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-download></bth-execucoes-download>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-execucoes-download></bth-execucoes-download>');
  });

  it('verifica regra de 30 dias do resultado', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-download></bth-execucoes-download>');
    const currentDate = new Date();
    const pastDate = new Date(currentDate.getTime() - (31 * 24 * 3600 * 1000)); // 31 dias atrás

    const element: HTMLBthExecucoesDownloadElement = page.rootInstance;
    element.concluidaEm = pastDate;
    element.gerouResultado = true;

    // Act
    await page.waitForChanges();

    // Assert
    const link = page.root.querySelector('a');
    expect(link).toBeNull();
  });

  it('deve renderizar o link de download', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-download></bth-execucoes-download>');
    const element: HTMLBthExecucoesDownloadElement = page.root as HTMLBthExecucoesDownloadElement;

    // Act
    element.concluidaEm = new Date();
    element.gerouResultado = true;
    element.execucoesApi = 'http://execucoes.com';
    element.execucaoId = '123';
    await page.waitForChanges();

    // Assert
    const link = page.root?.shadowRoot?.querySelector('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('http://execucoes.com/download/api/execucoes/123/resultado');
  });



  it('deve renderizar o documento assinado', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-download></bth-execucoes-download>');
    const element: HTMLBthExecucoesDownloadElement = page.root as HTMLBthExecucoesDownloadElement;

    // Act
    element.concluidaEm = new Date();
    element.gerouResultado = true;
    element.assinadorApi = 'http://assinador.com';
    element.propriedades = {
      idDocumentoAssinado: '123',
      possuiParticionamento: false
    };
    await page.waitForChanges();

    // Assert
    const link = page.root?.shadowRoot?.querySelector('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('http://assinador.com/api-download/documentos/123/download-assinado');
  });


  it('deve emitir evento errorClicked ao clicar no ícone de erro', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-download></bth-execucoes-download>');
    const element: HTMLBthExecucoesDownloadElement = page.root as HTMLBthExecucoesDownloadElement;

    // Act
    const spyErrorClicked = jest.fn();
    element.addEventListener('errorClicked', spyErrorClicked);

    element.statusValor = 'CONCLUIDO';
    element.conclusaoTipoValor = 'INTERROMPIDO';
    element.mensagemConclusao = 'Erro durante a execução';
    await page.waitForChanges();

    const errorIcon = page.root?.shadowRoot?.querySelector('span[title="Exibir mensagem"]');
    errorIcon?.dispatchEvent(new Event('click'));

    // Assert
    expect(spyErrorClicked).toHaveBeenCalled();
    expect(spyErrorClicked).toHaveBeenCalledWith(expect.objectContaining({
      detail: { identificador: element.execucaoId }
    }));
  });

});
