import { Component, Prop, Event, EventEmitter, h, ComponentInterface } from '@stencil/core';

@Component({
  tag: 'bth-assistente-tag',
  styleUrl: 'assistente-tag.scss',
  shadow: true,
})

export class BthAssistenteTag implements ComponentInterface {

  /**
   * Descrição
   */
  @Prop() readonly descricao: string;

  /**
   * Está ativo?
   */
  @Prop({ reflect: true }) readonly ativo: boolean = false;

  /**
   * É link?
   */
  @Prop() readonly link: boolean = false;

  /**
   * Visualizar como pasta/folder?
   */
  @Prop() readonly pasta: boolean = false;
  
  /**
   * Desativar click
   */
  @Prop({ reflect: true }) readonly lock: boolean = false;

  /**
 * É emitido ao clicar na tag
 */
  @Event() tagClicked: EventEmitter;
  private onClick = (event: UIEvent) => {
    event.preventDefault();

    if (this.lock) return;

    this.tagClicked.emit({
      identificador: this.descricao
    });
  }

  private getTipo(){
    const tipo = this.link ? 'tag__link' : this.pasta ? 'tag__folder' : 'tag__item';
    const lock = this.lock ? 'tag--lock': '';
    const active = this.ativo ? 'tag--active': '';
    return `tag ${tipo} ${lock} ${active}`; 
  }


  render() {
    return (
      <a href='' class={this.getTipo()} title={this.descricao} onClick={this.onClick}>
        {this.pasta && (<bth-icone icone={this.ativo ? 'arrow-left':'folder'}></bth-icone>)}
        {this.descricao}
        {this.pasta && !this.ativo && (<bth-icone class="actions" icone='arrow-right'></bth-icone>)}
      </a>
    );
  }

}
