import { Component, Prop, h, State, Listen, Element, Host, Event, EventEmitter } from '@stencil/core';

/**
 * @slot trigger - Acionador que abre e fecha o popover
 * @slot title - Titulo exibido no cabecalho do popover
 */
@Component({
  tag: 'bth-popover',
  styleUrl: 'popover.scss',
  shadow: true,
})

export class BthPopover {

  /** Posição do popover em relação ao trigger */
  @Prop() readonly position: string = 'bottom';

  /** Conteudo do popover */
  @Prop() readonly content: string;

  @State() isVisible: boolean = false;
  @State() buttonText: string = 'COPIAR';
  @State() buttonIcon: string = 'content-copy';

  @Element() el!: HTMLBthPopoverElement;

  /**
  * É emitido ao abrir ou fechar o popover pelo acionador
  */
  @Event() popoverToggled: EventEmitter;
  private togglePopover = () => {
    this.isVisible = !this.isVisible;
    this.popoverToggled.emit({ visivel: this.isVisible });
  };

  @Listen('click', { target: 'window' })
  handleClickOutside(event: Event) {
    const path = event.composedPath();
    if (this.isVisible && !path.includes(this.el)) {
      this.isVisible = false;
    }
  }


  @Listen('keydown', { target: 'window' })
  handleEscape(event: KeyboardEvent) {
    if (this.isVisible && event.key === 'Escape') {
      this.isVisible = false;
    }
  }

  private temConteudo(): boolean {
    return Boolean(this.content);
  }

  private copyContent = () => {
    if (this.temConteudo()) {
      navigator.clipboard.writeText(this.content).then(() => {
        this.buttonText = 'COPIADO';
        this.buttonIcon = 'check-bold';
        setTimeout(() => {
          this.buttonText = 'COPIAR';
          this.buttonIcon = 'content-copy';
        }, 2000);
      });
    }
  };


  render() {
    return (
      <Host>
        <div class="popover-container ">

          <button
            type="button"
            class="popover-trigger"
            aria-expanded={String(this.isVisible)}
            onClick={this.togglePopover}>
            <slot name="trigger"></slot>
          </button>
          {this.isVisible && (
            <div class={`popover-content popover-${this.position}`}>
              <span class="popover-header">
                <button type="button" class="close-button" aria-label="Fechar" onClick={this.togglePopover}><bth-icone icone="close"></bth-icone></button>
                <slot name="title"></slot>
              </span>
              {!this.temConteudo() && (
                <small><bth-loader></bth-loader></small>
              )}
              {this.temConteudo() && (
                <code class="popover-body">
                  {this.content}
                </code>
              )}
              <div class="popover-footer">
                <button type="button" class='fa-copy' onClick={this.copyContent}><i><bth-icone icone={this.buttonIcon}></bth-icone></i>{this.buttonText}</button>
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
