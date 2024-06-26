import { Component, Prop, h } from '@stencil/core';

import { getCssVariableValue} from '../../../utils/functions';
import { Tag } from '../assistente.interfaces';

@Component({
  tag: 'bth-assistente-item',
  styleUrl: 'assistente-item.scss',
  shadow: true,
})

export class BthAssistenteItem {

  /**
  * Identificador
  */
  @Prop() readonly identificador: string;

  /**
  * Descrição
  */
  @Prop() readonly descricao: string;

  /**
  * Ícone
  */
  @Prop() readonly icone: string;
  
  /**
  * Favorito
  */
  @Prop() readonly favorito: boolean;
  
  /**
  * Tags
  */
  @Prop() readonly tags: Tag[] = [];


  render() {
    return (
      <div class="assistente__list-item">

        <bth-assistente-fav ativo={this.favorito} identificador={this.identificador}></bth-assistente-fav>

        <div>
          <bth-icone cor={getCssVariableValue('--bth-app-gray-dark-20')} icone={this.icone}></bth-icone>
        </div>

        <div>
          <a href="">{this.descricao}</a>

          {this.tags.map((tag) => {
            return (
              <bth-assistente-tag lock descricao={tag.rotulo} ativo={tag.ativo}></bth-assistente-tag>
            );
          }
          )}
        </div>

        <div class="actions">
          <a href="" onClick={(e: UIEvent) => { e.preventDefault(); /* this.showExecucoes(extensao); */ }}>
            <small><bth-icone icone="history"></bth-icone> Recentes</small>
          </a>
          <a href="" onClick={(e: UIEvent) => { e.preventDefault(); }}>
            <small><bth-icone icone="play"></bth-icone> Executar</small>
          </a>
        </div>

      </div>
    );
  }

}
