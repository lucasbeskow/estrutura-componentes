import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthBusca } from '../busca';

describe('busca', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthBusca] });
  });

  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-busca></bth-busca>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-busca></bth-busca>');
  });

  it('renderiza com delay', async () => {
    // Arrange
    await page.setContent('<bth-busca></bth-busca>');

    // Act
    const busca: HTMLBthBuscaElement = page.doc.querySelector('bth-busca');
    const delay = '500';
    busca.setAttribute('delay', delay);
    await page.waitForChanges();

    // Assert
    expect(busca.getAttribute('delay')).toBe(delay);
  });

  it('emite evento ao limpar busca', async () => {
    // Arrange
    await page.setContent('<bth-busca></bth-busca>');

    // Act
    const busca: HTMLBthBuscaElement = page.doc.querySelector('bth-busca');
    const termo = 'teste';

    let onbuscaSubmit = jest.fn();
    busca.addEventListener('buscaSubmit', onbuscaSubmit);

    const buscaInput: HTMLInputElement = busca.shadowRoot.querySelector('input');
    buscaInput.value = termo;

    const cancel: HTMLAnchorElement = busca.shadowRoot.querySelector('a');
    cancel.click();
  
    await page.waitForChanges();

    // Assert
    expect(onbuscaSubmit).toHaveBeenCalled();
    expect(onbuscaSubmit.mock.calls[0][0].detail).toStrictEqual({
      termo: '',
    });
  });

  

});
