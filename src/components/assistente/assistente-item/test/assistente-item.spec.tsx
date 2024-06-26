import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthAssistenteItem } from '../assistente-item';

describe('bth-assistente-item', () => {
  
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthAssistenteItem] });
  });

  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-assistente-item></bth-assistente-item>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-assistente-item></bth-assistente-item>');
  });

});
