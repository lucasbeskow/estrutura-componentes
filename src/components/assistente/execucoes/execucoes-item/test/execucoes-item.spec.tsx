import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { BthExecucoesItem } from '../execucoes-item';

describe('bth-execucoes-item', () => {

  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({ components: [BthExecucoesItem] });
  });


  it('renderiza light dom', async () => {
    // Arrange
    await page.setContent('<bth-execucoes-item></bth-execucoes-item>');

    // Assert
    expect(page.root).toEqualLightHtml('<bth-execucoes-item></bth-execucoes-item>');
  });

});
