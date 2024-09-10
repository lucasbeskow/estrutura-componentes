import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

import { getCssVariableValue } from '../../../../utils/functions';

@Component({
  tag: 'bth-execucoes-download',
  styleUrl: 'execucoes-download.scss',
  shadow: true
})
export class BthExecucoesDownload {



  /**
   * objeto contendo a informação da execucao
   */
  // @Prop() readonly execucao: any;

  /** base url do assinador */
  @Prop() readonly assinadorApi: string;

  /** base url de execucoes */
  @Prop() readonly execucoesApi: string;

  /** ID da execução */
  @Prop() readonly execucaoId: string;

  /** Propriedades da execução */
  @Prop() readonly propriedades: any;

  /** Data em que a execução foi concluída */
  @Prop() readonly concluidaEm: Date;

  /** Indica se a execução gerou um resultado */
  @Prop() readonly gerouResultado: boolean;

  /** Protocolo associado à execução */
  @Prop() readonly protocolo: string;

  /** Tipo do artefato */
  @Prop() readonly artefatoTipo: string;

  /** Status atual da execução */
  @Prop() readonly statusValor: string;

  /** Status atual da execução */
  @Prop() readonly statusDescricao: string;

  /** Tipo de conclusão da execução */
  @Prop() readonly conclusaoTipoValor: string;

  /** Mensagem de conclusão da execução */
  @Prop() readonly mensagemConclusao: string;





  private resultadoDisponivel() {
    const currDate = new Date().getTime();
    const dateToTest = new Date(this.concluidaEm).getTime();
    return (currDate-dateToTest)/(24*3600*1000) < 30;
  }

  private possuiAssinatura() {
    return !!(this.propriedades || {})?.idDocumentoAssinado;
  }

  private possuiParticionamento() {
    return (this.propriedades || {})?.possuiParticionamento === 'true';
  }

  private zipAssinado() {
    return this.possuiAssinatura() && this.possuiParticionamento();
  }

  private docAssinado() {
    return this.possuiAssinatura() && !this.possuiParticionamento();
  }

  private getUrlDownload(){

    if (!this.resultadoDisponivel()){
      return;
    }

    if (this.zipAssinado()){
      //return `${this.getExecucoesApi()}/download/api/execucoes/${execucao.id}/resultado`;
      console.log('zip assinado');
    }

    if (this.docAssinado()){
      return `${this.assinadorApi}/api-download/documentos/${this.propriedades.idDocumentoAssinado}/download-assinado`;
    }

    return `${this.execucoesApi}/download/api/execucoes/${this.execucaoId}/resultado`;
  }

  /**
  * É emitido ao clicar
  */
  @Event() errorClicked: EventEmitter;
  private onClick = (event: UIEvent) => {
    event.preventDefault();
    this.errorClicked.emit({
      identificador: this.execucaoId
    });
  }


  render() {
    return (
      <div>
        {this.gerouResultado && (
          <a target={this.protocolo} href={this.getUrlDownload()}>

            <bth-icone icone={(this.propriedades?.idDocumentoAssinado)? 'file-check': (this.artefatoTipo === 'SCRIPT') ? 'file-download' : 'file'} />

            {(this.propriedades?.formatoExportacao !== 'PDF' || this.artefatoTipo === 'SCRIPT' || this.possuiParticionamento() ) ? (this.propriedades?.idDocumentoAssinado)? 'Resultado (Assinado)' : 'Resultado' : (this.propriedades?.idDocumentoAssinado)? 'Abrir (Assinado)':'Abrir'}

          </a>
        )}


        {this.statusValor === 'CONCLUIDO' && this.conclusaoTipoValor === 'INTERROMPIDO' && (

          <bth-popover position="left" content={this.mensagemConclusao}>
            <span title='Exibir mensagem' slot='trigger' onClick={this.onClick}>
              <bth-icone
                icone='alert'
                cor={getCssVariableValue('--bth-app-gray-dark-20')}
              />
                Erro
            </span>
            <span slot="title">Erro ao executar</span>
          </bth-popover>
        )}


      </div>
    );
  }

}
