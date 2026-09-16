import { newE2EPage, E2EPage } from '@stencil/core/testing';

import { analisarAcessibilidade, descreverViolacoes, REGRAS_WCAG_AAA } from './utils/a11y.helper';

/**
 * O Stencil monta os testes e2e em um documento minimo, sem <title> e sem lang.
 * Sao regras do documento hospedeiro, nao dos componentes analisados.
 */
const REGRAS_DO_DOCUMENTO = ['document-title', 'html-has-lang', 'landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Varredura automatizada de acessibilidade sobre os componentes.
 *
 * O axe cobre a parte verificável por máquina — ordem de foco, nome acessível,
 * papel e estado ARIA, contraste. Os critérios AAA que dependem de julgamento
 * humano seguem documentados em AUDITORIA_A11Y_WCAG_AAA.md.
 */
describe('acessibilidade', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it('bth-app não possui violações de nível A e AA', async () => {
    await page.setContent(`
      <bth-app>
        <bth-marca-produto slot="menu_marca_produto" produto="Lorem Ipsum"></bth-marca-produto>
        <section slot="container_aplicacao">
          <h1>Área da aplicação</h1>
        </section>
      </bth-app>
    `);

    await page.$eval('bth-app', (app: any) => {
      app.opcoes = [
        { id: 1, descricao: 'Visão geral', icone: 'chart-donut', isAtivo: true },
        { id: 2, descricao: 'Fluxo de trabalho', icone: 'file-tree' },
      ];
    });
    await page.waitForChanges();

    const violacoes = await analisarAcessibilidade(page, { regrasDesligadas: REGRAS_DO_DOCUMENTO });

    expect(descreverViolacoes(violacoes)).toBe('nenhuma violação');
  });

  it('bth-selecao-contexto não possui violações de nível A e AA', async () => {
    await page.setContent(`
      <bth-selecao-contexto id="contexto">
        <h4 slot="cabecalho">Selecione a entidade</h4>
      </bth-selecao-contexto>
    `);

    await page.$eval('bth-selecao-contexto', (contexto: any) => {
      contexto.buscar = () => Promise.resolve([
        { id: 1, descricao: 'Prefeitura Municipal de Criciuma', complemento: 'Último acesso em 27 de setembro' },
        { id: 2, descricao: 'Camara Municipal de Icara' },
      ]);
    });
    await page.waitForChanges();

    const violacoes = await analisarAcessibilidade(page, { regrasDesligadas: REGRAS_DO_DOCUMENTO });

    expect(descreverViolacoes(violacoes)).toBe('nenhuma violação');
  });

  it('bth-navbar-pill-group não possui violações de nível A e AA', async () => {
    await page.setContent(`
      <bth-navbar-pill-group descricao="Filtros">
        <bth-navbar-pill-item identificador="todas" descricao="Todas" icone="format-list-bulleted" ativo></bth-navbar-pill-item>
        <bth-navbar-pill-item identificador="nao-lidas" descricao="Nao lidas" icone="email-mark-as-unread" totalizador="7"></bth-navbar-pill-item>
      </bth-navbar-pill-group>
    `);
    await page.waitForChanges();

    const violacoes = await analisarAcessibilidade(page, { regrasDesligadas: REGRAS_DO_DOCUMENTO });

    expect(descreverViolacoes(violacoes)).toBe('nenhuma violação');
  });

  it('bth-empty-state não possui violações de nível A e AA', async () => {
    await page.setContent('<bth-empty-state registros show></bth-empty-state>');
    await page.waitForChanges();

    const violacoes = await analisarAcessibilidade(page, { regrasDesligadas: REGRAS_DO_DOCUMENTO });

    expect(descreverViolacoes(violacoes)).toBe('nenhuma violação');
  });

  it('bth-avatar não possui violações de nível A e AA', async () => {
    await page.setContent(`
      <bth-avatar iniciais="Lorem Ipsum" title="Lorem Ipsum"></bth-avatar>
      <bth-avatar icone="account" title="Sem foto"></bth-avatar>
    `);
    await page.waitForChanges();

    const violacoes = await analisarAcessibilidade(page, { regrasDesligadas: REGRAS_DO_DOCUMENTO });

    expect(descreverViolacoes(violacoes)).toBe('nenhuma violação');
  });

  it('bth-navbar-pill-group atinge o contraste ampliado de nível AAA', async () => {
    await page.setContent(`
      <bth-navbar-pill-group descricao="Filtros">
        <bth-navbar-pill-item identificador="todas" descricao="Todas" icone="format-list-bulleted" ativo></bth-navbar-pill-item>
      </bth-navbar-pill-group>
    `);
    await page.waitForChanges();

    const violacoes = await analisarAcessibilidade(page, { tags: REGRAS_WCAG_AAA, regrasDesligadas: REGRAS_DO_DOCUMENTO });

    expect(descreverViolacoes(violacoes)).toBe('nenhuma violação');
  });
});
