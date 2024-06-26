import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthAssistenteTag } from '../assistente-tag';

describe('tag', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthAssistenteTag] });
  });

  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-assistente-tag></bth-assistente-tag>');
  });

  it('renderiza com descrição', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    const descricao = 'Descrição';
    tag.setAttribute('descricao', descricao);
    await page.waitForChanges();

    // Assert
    expect(tag.getAttribute('descricao')).toBe(descricao);

    const descritor: HTMLSpanElement = tag.shadowRoot.querySelector('.tag');
    expect(descritor.textContent).toBe(descricao);
  });

  it('renderiza tag', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    tag.setAttribute('pasta', 'false');
    await page.waitForChanges();

    // Assert
    expect(tag.pasta).toBe(false);

    const block: HTMLDivElement = tag.shadowRoot.querySelector('.tag');
    expect(block.classList.contains('tag__item')).toBeTruthy();
  });

  it('renderiza folder', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    tag.setAttribute('pasta', 'true');
    await page.waitForChanges();

    // Assert
    expect(tag.pasta).toBe(true);

    const block: HTMLDivElement = tag.shadowRoot.querySelector('.tag');
    expect(block.classList.contains('tag__folder')).toBeTruthy();
  });

  it('renderiza ativo', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    tag.setAttribute('ativo', 'true');
    await page.waitForChanges();

    // Assert
    expect(tag.ativo).toBe(true);

    const block: HTMLDivElement = tag.shadowRoot.querySelector('.tag');
    expect(block.classList.contains('tag--active')).toBeTruthy();
  });
  
  it('renderiza lock', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    tag.setAttribute('lock', 'true');
    await page.waitForChanges();

    // Assert
    expect(tag.lock).toBe(true);

    const block: HTMLDivElement = tag.shadowRoot.querySelector('.tag');
    expect(block.classList.contains('tag--lock')).toBeTruthy();
  });
  
  it('renderiza link', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    tag.setAttribute('link', 'true');
    await page.waitForChanges();

    // Assert
    expect(tag.link).toBe(true);

    const block: HTMLDivElement = tag.shadowRoot.querySelector('.tag');
    expect(block.classList.contains('tag__link')).toBeTruthy();
  });

  it('emite evento ao ser selecionado', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    const tagId = 'tagId1';

    tag.setAttribute('descricao', tagId);

    let tagClicked = jest.fn();
    tag.addEventListener('tagClicked', tagClicked);

    const tagLink: HTMLAnchorElement = tag.shadowRoot.querySelector('a');
    tagLink.click();
    await page.waitForChanges();

    // Assert
    expect(tagClicked).toHaveBeenCalled();
    expect(tagClicked.mock.calls[0][0].detail).toStrictEqual({
      identificador: tagId,
    });
  });
  
  it('não emite evento com lock', async () => {
    // Arrange
    await page.setContent('<bth-assistente-tag></bth-assistente-tag>');

    // Act
    const tag: HTMLBthAssistenteTagElement = page.doc.querySelector('bth-assistente-tag');
    const tagId = 'tagId1';

    tag.setAttribute('descricao', tagId);
    tag.setAttribute('lock', 'true');

    let tagClicked = jest.fn();
    tag.addEventListener('tagClicked', tagClicked);

    const tagLink: HTMLAnchorElement = tag.shadowRoot.querySelector('a');
    tagLink.click();
    await page.waitForChanges();

    // Assert
    expect(tagClicked).not.toHaveBeenCalled();
    
  });

});
