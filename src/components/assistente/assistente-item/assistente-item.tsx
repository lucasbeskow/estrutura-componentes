import { Component, Host, Prop, State, h } from '@stencil/core';

import { AuthorizationConfig } from '../../../global/interfaces';
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

  /**
  * Configuração de autorização. É necessária para o componente de execucoes poder realizar autentizar com os serviços.
  */
  @Prop() readonly authorization: AuthorizationConfig;

  /**
  * Identificador da extensão
  */
  @Prop() readonly extensaoId?: string;

  @State() showDetalhesExecucoes: boolean = false;


  private showExecucoes = () => {
    this.showDetalhesExecucoes = !this.showDetalhesExecucoes;
  };


  render() {
    return (
      <Host>
        <div class="assistente__list-item">

          <bth-assistente-fav ativo={this.favorito} identificador={this.identificador}></bth-assistente-fav>

          <div>
            <bth-icone cor={getCssVariableValue('--bth-app-gray-dark-20')} icone={this.icone}></bth-icone>
          </div>

          <div>
            <span class="descricao">{this.descricao}</span>

            {this.tags.map((tag) => {
              return (
                <bth-assistente-tag lock descricao={tag.rotulo} ativo={tag.ativo}></bth-assistente-tag>
              );
            }
            )}
          </div>

          <div class="actions">
            <button type="button" aria-expanded={String(this.showDetalhesExecucoes)} onClick={this.showExecucoes}>
              <small><bth-icone icone="history"></bth-icone> Recentes</small>
            </button>
            <button type="button">
              <small><bth-icone icone="play"></bth-icone> Executar</small>
            </button>
          </div>



        </div>
        <div>
          { this.showDetalhesExecucoes && (
            <bth-execucoes
              authorization={this.authorization}
              execucaoId={this.extensaoId}
            >
            </bth-execucoes>
          )}
        </div>
      </Host>
    );
  }

}
