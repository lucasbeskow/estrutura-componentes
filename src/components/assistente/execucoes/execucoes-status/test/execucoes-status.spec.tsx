import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthExecucoesStatus } from '../execucoes-status';

describe('bth-execucoes-status', () => {

  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthExecucoesStatus] });
  });


  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-execucoes-status></bth-execucoes-status>');
  });



  it('deve renderizar o ícone correto para status SOLICITADO', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'SOLICITADO';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('clock');
  });



  it('deve renderizar o ícone correto para status PREPARANDO', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'PREPARANDO';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('clock');
  });



  it('deve renderizar o ícone correto para status AGUARDANDO_QUOTA', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'AGUARDANDO_QUOTA';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('clock');
  });



  it('deve renderizar o ícone correto para status AGUARDANDO_EXECUCAO', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'AGUARDANDO_EXECUCAO';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('clock');
  });



  it('deve renderizar o ícone correto para status CANCELANDO', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'CANCELANDO';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('stop-circle');
  });



  it('deve renderizar o ícone correto para status EXECUTANDO', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'EXECUTANDO';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('play-circle');
  });



  it('deve renderizar o ícone correto para status CONCLUIDO com sucesso', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'CONCLUIDO';
    element.conclusaoTipoValor = 'SUCESSO';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('check-circle');
  });



  it('deve renderizar o ícone correto para status CONCLUIDO com falha', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-status></bth-execucoes-status>');
    const element: HTMLBthExecucoesStatusElement = page.root as HTMLBthExecucoesStatusElement;

    // Act
    element.statusValor = 'CONCLUIDO';
    element.conclusaoTipoValor = 'INTERROMPIDO';
    await page.waitForChanges();

    // Assert
    const icon = page.root?.shadowRoot?.querySelector('bth-icone');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('icone')).toBe('alert-circle');
  });
});
