import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bth-execucoes-item',
  styleUrl: 'execucoes-item.scss',
  shadow: true,
})
export class BthExecucoesItem {

  /** objeto contendo a informação da execucao */
  @Prop() readonly execucao: any;

  /** base url do assinador */
  @Prop() readonly assinadorApi: string;

  /** base url de execucoes */
  @Prop() readonly execucoesApi: string;

  /** base url de consulta */
  @Prop() readonly consultaApi: string;

  /** ID da execução */
  @Prop() readonly execucaoId: string;

  /** Data em que a execução foi concluída */
  @Prop() readonly concluidaEm: Date;

  /** Propriedades da execução */
  @Prop() readonly propriedades: any;

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

  /** Versão do artefato */
  @Prop() readonly artefatoVersao: string;

  /** Visibilidade da execução */
  @Prop() readonly visibilidadeValor: string;

  /** Autor da execução */
  @Prop() readonly autor: string;

  /** Data em que a execução foi iniciada */
  @Prop() readonly iniciadaEm: Date;

  /** Duração da execução em milissegundos */
  @Prop() readonly duracaoValor: number;

  /** Mensagem de conclusão da execução */
  @Prop() readonly mensagemConclusao: string;


  private formatarData(date): string {
    const data: Date = new Date(date);

    const dia: string = data.getDate().toString().padStart(2, '0');
    const mes: string = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano: number = data.getFullYear();
    const hora: string = data.getHours().toString().padStart(2, '0');
    const minuto: string = data.getMinutes().toString().padStart(2, '0');
    const segundo: string = data.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
  }

  private formatarduracao(milissegundos: number): string {
    const horas: number = Math.floor(milissegundos / 3600000);
    const minutos: number = Math.floor((milissegundos % 3600000) / 60000);
    const segundos: number = Math.floor((milissegundos % 60000) / 1000);
    const milissegundosRestantes: number = milissegundos % 1000;

    const horasStr: string = horas.toString().padStart(2, '0');
    const minutosStr: string = minutos.toString().padStart(2, '0');
    const segundosStr: string = segundos.toString().padStart(2, '0');
    const milissegundosStr: string = milissegundosRestantes.toString().padStart(3, '0');

    return `${horasStr}:${minutosStr}:${segundosStr}.${milissegundosStr}`;
  }

  private getUrlConsulta(protocolo:string){
    return `${this.consultaApi}/#/${protocolo}`;
  }

  render() {
    return (
      <div class="execucao__list-item">
        <div>
          <bth-execucoes-status
            statusValor={this.statusValor}
            statusDescricao={this.statusDescricao}
            conclusaoTipoValor={this.conclusaoTipoValor}
            propriedades={this.propriedades}
            visibilidadeValor={this.visibilidadeValor}
            autor={this.autor}
            artefatoVersao={this.artefatoVersao}>
          </bth-execucoes-status>
        </div>

        <div>
          {this.formatarData(this.iniciadaEm)}
        </div>
        <div>
          {this.formatarduracao(this.duracaoValor)} <a target='_blank' href={this.getUrlConsulta(this.protocolo)}><bth-icone icone="open-in-new" /></a>
        </div>

        <div class="actions">
          <bth-execucoes-download
            assinadorApi={this.assinadorApi}
            execucoesApi={this.execucoesApi}
            execucaoId={this.execucaoId}
            propriedades={this.propriedades}
            concluidaEm={this.concluidaEm}
            gerouResultado={this.gerouResultado}
            protocolo={this.protocolo}
            artefatoTipo={this.artefatoTipo}
            statusValor={this.statusValor}
            statusDescricao={this.statusDescricao}
            conclusaoTipoValor={this.conclusaoTipoValor}
            mensagemConclusao={this.mensagemConclusao}>
          </bth-execucoes-download>
        </div>
      </div>
    );
  }

}
