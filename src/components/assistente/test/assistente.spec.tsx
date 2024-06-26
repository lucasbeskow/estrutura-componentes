import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthAssistente } from '../assistente';

describe('assistente', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthAssistente] });
  });

  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-assistente></bth-assistente>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-assistente></bth-assistente>');
  });

});
