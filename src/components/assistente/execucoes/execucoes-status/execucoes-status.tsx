import { Component, h, Prop } from '@stencil/core';

import { getCssVariableValue } from '../../../../utils/functions';

@Component({
  tag: 'bth-execucoes-status',
  styleUrl: 'execucoes-status.scss',
  shadow: true,
})

export class BthExecucoesStatus {

  /** Status atual da execução */
  @Prop() readonly statusValor: string;

  /** Status atual da execução */
  @Prop() readonly statusDescricao: string;

  /** Tipo de conclusão da execução */
  @Prop() readonly conclusaoTipoValor: string;

  /** Propriedades da execução */
  @Prop() readonly propriedades: any;

  /** Visibilidade da execução */
  @Prop() readonly visibilidadeValor: string;

  /** Autor da execução */
  @Prop() readonly autor: string;

  /** Versão do artefato gerado pela execução */
  @Prop() readonly artefatoVersao: string;


  private getStatus() {

    if (!this.statusValor) {
      return;
    }

    switch (this.statusValor) {
      case 'SOLICITADO':
      case 'PREPARANDO':
      case 'AGUARDANDO_QUOTA':
      case 'AGUARDANDO_EXECUCAO':
        return (<bth-icone icone='clock' cor={getCssVariableValue('--bth-app-yellow')}></bth-icone>);

      case 'CANCELANDO':
        return (<bth-icone icone='stop-circle' cor={getCssVariableValue('--bth-app-red')}></bth-icone>);

      case 'EXECUTANDO':
        return (<bth-icone icone='play-circle' cor={getCssVariableValue('--bth-app-blue')}></bth-icone>);

      case 'CONCLUIDO':

        if(this.conclusaoTipoValor !== 'SUCESSO') {
          return (<bth-icone icone='alert-circle' cor={getCssVariableValue('--bth-app-red')}></bth-icone>);
        }

        return (<bth-icone icone='check-circle' cor={getCssVariableValue('--bth-app-green')}></bth-icone>);
    }
  }

  render() {
    return (
      <div>
        {this.getStatus()} {this.statusDescricao} / Versão {this.artefatoVersao} / {this.visibilidadeValor === 'PRIVADO' ? <bth-icone icone="lock"/> : ''} @{this.autor}
        {this.propriedades?.contextoAlvo && (
          <div>
            <small title={`Execução realizada no contexto da entidade ${JSON.parse(this.propriedades?.contextoAlvo).nome}`}>
              <bth-icone icone="home" />
              {JSON.parse(this.propriedades?.contextoAlvo).nome}
            </small>
          </div>
        )}
      </div>
    );
  }

}
