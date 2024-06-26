import { Component, Prop, Event, EventEmitter, h, Listen, ComponentInterface, State } from '@stencil/core';

@Component({
  tag: 'bth-busca',
  styleUrl: 'busca.scss',
  shadow: true,
})

export class BthBusca implements ComponentInterface {

  @State() termo: string;

  /**
   * Delay
   */
  @Prop() readonly delay: number = 500;

  /**
  * É emitido ao realizar busca
  */
  @Event() buscaSubmit: EventEmitter;
  private buscar = () => {
    this.buscaSubmit.emit({
      termo: this.termo
    });
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      clearTimeout(this.timeoutPesquisa); 
      this.buscar();
    }
  }


  private timeoutPesquisa;
  private onInputSearch = async (event: KeyboardEvent) => {

    this.termo = (event.target as HTMLInputElement).value;

    clearTimeout(this.timeoutPesquisa); 

    if (this.termo === '') {
      this.buscar();
      return;
    }

    await new Promise(resolve => {
      this.timeoutPesquisa = setTimeout(resolve, this.delay);
    });
    
    this.buscar();

  }

  private cancelSearch = (event: UIEvent) =>{
    event.preventDefault();
    clearTimeout(this.timeoutPesquisa);
    this.termo = '';
    this.buscar();
  }

  render() {
    return (
      <div class="busca">
        <input
          type="text"
          class="form-control"
          placeholder="Digite os termos para pesquisar"
          tabindex="1"
          value={this.termo}
          onInput={this.onInputSearch}
          aria-label="Digite os termos para pesquisar" />
          
        <a class="icone" href="" onClick={this.cancelSearch}>
          <bth-icone tamanho='22px' icone={this.termo ? 'close' : 'magnify'}></bth-icone>
        </a>

      </div>
    );
  }

}
