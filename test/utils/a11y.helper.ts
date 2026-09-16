import { AxePuppeteer } from '@axe-core/puppeteer';
import { E2EPage } from '@stencil/core/testing';
import type { Result } from 'axe-core';

/**
 * Regras que o axe avalia por padrão em cada nível do WCAG.
 *
 * `wcag2aaa` cobre apenas os critérios AAA que o axe consegue verificar sem
 * julgamento humano — hoje, essencialmente contraste ampliado (1.4.6). O
 * restante do nível AAA continua dependendo de revisão manual: ver
 * AUDITORIA_A11Y_WCAG_AAA.md.
 */
export const REGRAS_WCAG_A_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
export const REGRAS_WCAG_AAA = [...REGRAS_WCAG_A_AA, 'wcag2aaa'];

export interface OpcoesAnalise {
  /** Tags de regra do axe. Por padrão, A e AA. */
  tags?: Array<string>;
  /** Regras desligadas nesta análise, com a justificativa no próprio teste. */
  regrasDesligadas?: Array<string>;
}

/**
 * Roda o axe-core na página e devolve apenas as violações.
 *
 * O axe atravessa shadow DOM, então analisar a página inteira já cobre o
 * conteúdo interno dos componentes.
 */
export async function analisarAcessibilidade(page: E2EPage, opcoes: OpcoesAnalise = {}): Promise<Array<Result>> {
  const { tags = REGRAS_WCAG_A_AA, regrasDesligadas = [] } = opcoes;

  let analise = new AxePuppeteer(page as any).withTags(tags);

  if (regrasDesligadas.length > 0) {
    analise = analise.disableRules(regrasDesligadas);
  }

  const resultado = await analise.analyze();

  return resultado.violations;
}

/**
 * Formata as violações em uma mensagem legível, uma linha por ocorrência.
 */
export function descreverViolacoes(violacoes: Array<Result>): string {
  if (violacoes.length === 0) {
    return 'nenhuma violação';
  }

  return violacoes
    .map(violacao => {
      const alvos = violacao.nodes.map(node => node.target.join(' ')).join(', ');
      return `[${violacao.impact}] ${violacao.id}: ${violacao.help} (${alvos})`;
    })
    .join('\n');
}

/**
 * Falha o teste caso a página tenha qualquer violação nas tags informadas.
 */
export async function expectSemViolacoesDeAcessibilidade(page: E2EPage, opcoes: OpcoesAnalise = {}): Promise<void> {
  const violacoes = await analisarAcessibilidade(page, opcoes);

  expect(descreverViolacoes(violacoes)).toBe('nenhuma violação');
}
