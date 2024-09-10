import { Component, Prop, h, State, Listen, Element, Host } from '@stencil/core';

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

  private togglePopover() {
    this.isVisible = !this.isVisible;
  }

  @Listen('click', { target: 'window' })
  handleClickOutside(event: Event) {
    const path = event.composedPath();
    if (this.isVisible && !path.includes(this.el)) {
      this.isVisible = false;
    }
  }


  private copyContent() {
    if (this.content) {
      navigator.clipboard.writeText(this.content).then(() => {
        this.buttonText = 'COPIADO';
        this.buttonIcon = 'check-bold';
        setTimeout(() => {
          this.buttonText = 'COPIAR';
          this.buttonIcon = 'content-copy';
        }, 2000);
      });
    }
  }


  render() {
    return (
      <Host>
        <div class="popover-container ">

          <div class="popover-trigger" onClick={() => this.togglePopover()}>
            <slot name="trigger"></slot>
          </div>
          {this.isVisible && (
            <div class={`popover-content popover-${this.position}`}>
              <span class="popover-header">
                <button class="close-button" onClick={() => this.togglePopover()}><bth-icone icone="close"></bth-icone></button>
                <slot name="title"></slot>
              </span>
              {!this.content && (
                <small><bth-loader></bth-loader></small>
              )}
              {this.content && (
                <code class="popover-body">
                  {this.content}
                </code>
              )}
              <div class="popover-footer">
                <button class='fa-copy' onClick={() => this.copyContent()}><i><bth-icone icone={this.buttonIcon}></bth-icone></i>{this.buttonText}</button>
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
