import { Component, h, Prop, ComponentInterface, Host } from '@stencil/core';

import { isNill } from '../../../utils/functions';

@Component({
  tag: 'bth-icone',
  styleUrl: 'icone.css',
  shadow: true
})
export class Icone implements ComponentInterface {

  /**
   * Identificador do ícone conforme biblioteca `"Material Design Icons"`
   */
  @Prop({ reflect: true }) readonly icone!: string;

  /**
   * Tamanho em pixels, no mesmo formato do `"font-size"` em CSS.
   * Por padrão irá herdar do contexto inserido.
   */
  @Prop({ reflect: true }) readonly tamanho: string = 'inherit';

  /**
   * Cor de preenchimento, no mesmo formato do `"color"` em CSS.
   * Por padrão irá herdar do contexto inserido.
   */
  @Prop({ reflect: true }) readonly cor?: string = 'inherit';

  /**
   * Especifica o label a ser utilizado para acessibilidade.
   *
   * Sem este atributo o ícone é tratado como decorativo e fica fora da árvore
   * de acessibilidade, para não ser anunciado com o nome técnico do ícone.
   * Informe um label apenas quando o ícone carregar informação que não está
   * disponível no texto ao redor.
   */
  @Prop({ reflect: true }) readonly ariaLabel: string | null;

  private isDecorativo(): boolean {
    return isNill(this.ariaLabel) || this.ariaLabel.trim() === '';
  }

  render() {
    if (this.isDecorativo()) {
      return (
        <Host aria-hidden="true">
          <i class={`mdi mdi-${this.icone}`} style={{ 'font-size': this.tamanho, 'color': this.cor }}>
          </i>
        </Host>
      );
    }

    return (
      <Host role="img">
        <i class={`mdi mdi-${this.icone}`} style={{ 'font-size': this.tamanho, 'color': this.cor }}>
        </i>
      </Host>
    );
  }

}
