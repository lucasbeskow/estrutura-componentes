import { Component, h, Prop, ComponentInterface } from '@stencil/core';

@Component({
  tag: 'bth-navbar-pill-group',
  styleUrl: 'navbar-pill-group.scss',
  shadow: true,
})
export class NavbarPillGroup implements ComponentInterface {

  /**
   * Descrição
   */
  @Prop() readonly descricao: string;

  render() {
    return (
      <div class="navbar-pill-group" role="group" aria-label={`Filtros ${this.descricao?.toLowerCase()}`}>
        <slot />
      </div>
    );
  }

}
