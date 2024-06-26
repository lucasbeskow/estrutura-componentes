import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

import { getCssVariableValue} from '../../../utils/functions';

@Component({
  tag: 'bth-assistente-fav',
  styleUrl: 'assistente-fav.css',
  shadow: true,
})
export class BthAssistenteFav {

  /**
  * Identificador
  * É enviado no evento de click.
  */
  @Prop() readonly identificador: string;

  /**
  * Ativo?
  */
  @Prop() readonly ativo: boolean;

  /**
  * É emitido ao clicar
  */
  @Event() favClicked: EventEmitter;
  private onClick = (event: UIEvent) => {
    event.preventDefault();
    this.favClicked.emit({
      identificador: this.identificador
    });
  }

  render() {
    return (
      <bth-icone 
        onClick={this.onClick}
        cor={this.ativo ? getCssVariableValue('--bth-app-yellow') : getCssVariableValue('--bth-app-gray-dark-10')}
        icone={this.ativo ? 'star' : 'star-outline' }>
      </bth-icone>
    );
  }

}
