import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthAssistenteFav } from '../assistente-fav';

describe('bth-assistente-fav', () => {

  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthAssistenteFav] });
  });

  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-assistente-fav></bth-assistente-fav>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-assistente-fav></bth-assistente-fav>');
  });

  it('renderiza ativo', async () => {
    // Arrange
    await page.setContent('<bth-assistente-fav></bth-assistente-fav>');

    // Act
    const element: HTMLBthAssistenteFavElement = page.doc.querySelector('bth-assistente-fav');
    element.setAttribute('ativo', 'true');
    await page.waitForChanges();

    // Assert
    expect(element.ativo).toBe(true);
    
    const block: HTMLBthIconeElement = element.shadowRoot.querySelector('bth-icone');
    expect(block.getAttribute('icone')).toBe('star');
  });
  
  it('renderiza inativo', async () => {
    // Arrange
    await page.setContent('<bth-assistente-fav></bth-assistente-fav>');

    // Act
    const element: HTMLBthAssistenteFavElement = page.doc.querySelector('bth-assistente-fav');
    element.setAttribute('ativo', 'false');
    await page.waitForChanges();

    // Assert
    expect(element.ativo).toBe(false);
    
    const block: HTMLBthIconeElement = element.shadowRoot.querySelector('bth-icone');
    expect(block.getAttribute('icone')).toBe('star-outline');
  });

  it('emite evento ao ser selecionado', async () => {
    // Arrange
    await page.setContent('<bth-assistente-fav></bth-assistente-fav>');

    // Act
    const element: HTMLBthAssistenteFavElement = page.doc.querySelector('bth-assistente-fav');
    const favId = 'favId1';

    element.setAttribute('identificador', favId);

    let favClicked = jest.fn();
    element.addEventListener('favClicked', favClicked);

    const block: HTMLBthIconeElement = element.shadowRoot.querySelector('bth-icone');
    block.click();
    await page.waitForChanges();

    // Assert
    expect(favClicked).toHaveBeenCalled();
    expect(favClicked.mock.calls[0][0].detail).toStrictEqual({
      identificador: favId,
    });
  });

  

});
