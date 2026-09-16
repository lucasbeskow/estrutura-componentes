import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthPopover } from '../popover';


describe('bth-popover', () => {

  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthPopover] });
  });


  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-popover></bth-popover>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-popover></bth-popover>');
  });



  it('deve ativar popover', async () => {
    // Arrange
    await page.setContent('<bth-popover></bth-popover>');
    const component = page.rootInstance as BthPopover;

    //Act
    // O composedPath do mock-doc nao atravessa o shadow root, entao o host
    // nunca aparece no caminho e o handleClickOutside fecharia o popover.
    const composedPath = jest.spyOn(Event.prototype, 'composedPath').mockReturnValue([component.el]);

    const trigger = page.root.shadowRoot.querySelector('.popover-trigger') as HTMLDivElement;
    trigger.click();
    await page.waitForChanges();

    composedPath.mockRestore();

    // Assert
    expect(component.isVisible).toBe(true);
  });



  it('deve fechar o popover ao clicar fora', async () => {
    // Arrange
    await page.setContent('<bth-popover></bth-popover>');
    const component = page.rootInstance as BthPopover;
    component.isVisible = true;

    //Act
    const clickEvent = new Event('click', { bubbles: true, composed: true });
    clickEvent.composedPath = () => [];
    window.dispatchEvent(clickEvent);
    await page.waitForChanges();

    // Assert
    expect(component.isVisible).toBe(false);
  });



  it('não deve fechar o popover ao clicar dentro', async () => {
    // Arrange
    await page.setContent('<bth-popover></bth-popover>');
    const component = page.rootInstance as BthPopover;
    component.isVisible = true;

    // Act
    const clickEvent = new Event('click', { bubbles: true, composed: true });
    clickEvent.composedPath = () => [component.el]; // Mock para incluir o elemento do componente
    window.dispatchEvent(clickEvent);
    await page.waitForChanges();

    // Assert
    expect(component.isVisible).toBe(true);
  });



  it('deve copiar o conteúdo para a área de transferência e atualizar o texto e ícone do botão', async () => {
    // Arrange
    await page.setContent('<bth-popover content="conteúdo de teste"></bth-popover>');
    const component = page.rootInstance as BthPopover;
    component.isVisible = true;

    // Mock do navigator.clipboard.writeText
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    await page.waitForChanges();

    // Act
    const copyButton = page.root.shadowRoot.querySelector('.popover-footer button') as HTMLButtonElement;

    // Os timers falsos ficam restritos ao trecho que avanca os 2000 ms: com
    // eles ativos o waitForChanges do Stencil nunca resolve.
    jest.useFakeTimers();
    copyButton.click();
    await Promise.resolve();

    // Assert
    expect(writeTextMock).toHaveBeenCalledWith('conteúdo de teste');
    expect(component.buttonText).toBe('COPIADO');
    expect(component.buttonIcon).toBe('check-bold');

    // Simula a espera de 2000 ms
    jest.advanceTimersByTime(2000);
    jest.useRealTimers();
    await page.waitForChanges();

    expect(component.buttonText).toBe('COPIAR');
    expect(component.buttonIcon).toBe('content-copy');
  });



  it('deve fechar o popover ao clicar no botão de fechar', async () => {
    // Arrange
    await page.setContent('<bth-popover></bth-popover>');
    const component = page.rootInstance as BthPopover;
    component.isVisible = true;
    await page.waitForChanges();

    // Act
    const closeButton = page.root.shadowRoot.querySelector('.close-button') as HTMLButtonElement;
    closeButton.click();
    await page.waitForChanges();

    // Assert: Verifica se o popover foi fechado
    expect(component.isVisible).toBe(false);
  });

});
