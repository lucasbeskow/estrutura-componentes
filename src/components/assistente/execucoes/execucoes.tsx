import { Component, State, h, Prop, Watch, Element, ComponentInterface, Listen } from '@stencil/core';

import { isValidAuthorizationConfig } from '../../../global/api';
import { AuthorizationConfig } from '../../../global/interfaces';
import { isNill} from '../../../utils/functions';
import { PromiseTracker } from '../../../utils/promise-tracker';
import { OpcaoFiltro, TipoExecucao, PaginationParams } from './execucoes.interfaces';
import { ExecucoesService } from './execucoes.service';



@Component({
  tag: 'bth-execucoes',
  styleUrl: 'execucoes.scss',
  shadow: true,
})

export class BthExecucoes implements ComponentInterface{

  private execucoesService: ExecucoesService;
  private paginationControl: any = { offset: 1, limit: 10, hasNext: false };


  private tracker = new PromiseTracker((active: boolean) => {
    this.isCarregando = active;
  });

  private trackerConclusao = new PromiseTracker((active: boolean) => {
    this.isCarregandoConclusao = active;
  });

  @Element() el!: HTMLBthExecucoesElement;

  @State() isApiIndisponivel: boolean = false;
  @State() isCarregando: boolean = false;
  @State() isCarregandoConclusao: boolean = false;

  @State() execucoes: Array<any> = [];
  @State() execucoesUsuario: boolean = true;
  @State() conclusao: string;

  @State() filtros: Array<OpcaoFiltro> = [
    { id: TipoExecucao.minhas, icone: '', descricao: 'Minhas', ativo: false },
    { id: TipoExecucao.todas, icone: '', descricao: 'Todos', ativo: false }
  ]



  /**
  * Configuração de autorização. É necessária para o componente poder realizar autentizar com os serviços.
  */
  @Prop() readonly authorization: AuthorizationConfig;

  /**
  * URL para a api de execucoes. Por padrão irá obter do env.js
  */
  @Prop() readonly execucoesApi?: string;

  /**
  * URL para a api do assinador. Por padrão irá obter do env.js
  */
  @Prop() readonly assinadorApi?: string;

  /**
  * URL para a api de consulta. Por padrão irá obter do env.js
  */
  @Prop() readonly consultaApi?: string;



  /**
  * Identificador da extensão
  */
  @Prop() readonly execucaoId?: string;







  // @Listen('navbarPillItemClicked')
  // onNavbarPillItemClicked(data: CustomEvent): void {
  //   const { identificador } = data.detail;
  //   console.log(data)
  //   this.getExecucoes();

  // }



  @Watch('authorization')
  @Watch('execucoesApi')
  @Watch('assinadorApi')
  @Watch('consultaApi')
  onChangeApiRelatedProperties(): void {
    this.inicializarServices();
  }

  @Watch('execucaoId')
  onChangeExecucaoId(): void {
    this.getExecucoes();
  }

  componentWillLoad() {
    this.getExecucoes();
  }


  connectedCallback() {
    this.inicializarServices();
  }

  @Listen('errorClicked')
  onErrorClicked(data: CustomEvent): void {
    const { identificador } = data.detail;
    this.getConclusao(identificador);
  }

  private inicializarServices() {
    if (this.isConfiguracaoApiInconsistente()) {
      console.warn('[bth-execucoes] O endereço do serviço de execuções e as credenciais de autenticação devem ser informados. Consulte a documentação do componente.');
      this.isApiIndisponivel = true;
      return;
    }
    this.isApiIndisponivel = false;
    this.execucoesService = new ExecucoesService(this.authorization, this.getExecucoesApi());

  }

  private isConfiguracaoApiInconsistente() {
    if (isNill(this.getExecucoesApi())) {
      return true;
    }

    if (isNill(this.getAssinadorApi())) {
      return true;
    }

    if (isNill(this.getConsultaApi())) {
      return true;
    }

    if (!isValidAuthorizationConfig(this.authorization)) {
      return true;
    }

    return false;
  }


  private getExecucoesApi(): string {

    if (!isNill(this.execucoesApi)) {
      return this.execucoesApi;
    }

    if ('___bth' in window) {
      return window['___bth']?.envs?.suite?.['plataforma-execucoes']?.v1?.host;
    }

    return null;
  }

  private getAssinadorApi(): string {
    if (!isNill(this.assinadorApi)) {
      return this.assinadorApi;
    }

    if ('___bth' in window) {
      return window['___bth']?.envs?.suite?.['assinador']?.v1?.host;
    }

    return null;
  }

  private getConsultaApi(): string {
    if (!isNill(this.consultaApi)) {
      return this.consultaApi;
    }

    if ('___bth' in window) {
      return window['___bth']?.envs?.suite?.['plataforma-consulta-execucoes']?.v1?.host;
    }

    return null;
  }


  private getFiltersParams(){

    let filter:Array<any> = [];

    filter.push(`artefato.id = "${this.execucaoId}"`);
    filter.push('artefatoInfo.disponivel = \'S\'');

    return filter.join(' and ');

  }


  private async getExecucoes(){

    const paginationParams: PaginationParams = {
      'offset': (this.paginationControl.offset - 1) * this.paginationControl.limit,
      'limit': this.paginationControl.limit.toString(),
      'filter': this.getFiltersParams()
    };

    if (this.isApiIndisponivel) {
      this.inicializarServices();
      if (this.isApiIndisponivel) {
        return;
      }
    }



    const api = this.execucoesUsuario
      ? this.execucoesService.execucoesUsuario(paginationParams)
      : this.execucoesService.execucoes(paginationParams);

    const promise = api.then(execucoes => {

      //console.log('logs: ', execucoes);
      this.execucoes = execucoes.content;
      this.paginationControl.hasNext = execucoes.hasNext;
    })
      .catch(() => this.isApiIndisponivel = true);

    this.tracker.addPromise(promise);

  }

  // private onClickAtualizar = (event: UIEvent): void => {
  //   event.preventDefault();
  //   this.getExecucoes();
  // }

  private onClickAll= (event: UIEvent): void => {
    event.preventDefault();
    this.execucoesUsuario = false;
    this.resetPagination();
    this.getExecucoes();
  }

  private onClickUser= (event: UIEvent): void => {
    event.preventDefault();
    this.execucoesUsuario = true;
    this.resetPagination();
    this.getExecucoes();
  }

  private resetPagination(): void {
    this.paginationControl.offset = 1;
  }

  private nextPage = (): void =>{
    if (!this.paginationControl.hasNext) {
      return;
    }

    this.paginationControl.offset++;
    this.getExecucoes();
  }

  private prevPage = (): void =>{
    if (this.paginationControl.offset === 1) {
      return;
    }

    this.paginationControl.offset--;
    this.getExecucoes();
  }

  private getConclusao(execucaoId: string) {
    const execucao = this.execucoes.find(e => e.id === execucaoId);
    //execucao.teste = 'teste';

    if (this.isCarregandoConclusao) return;

    const api = this.execucoesService.getConclusao(execucaoId);

    const promise = api.then(response => {
      //this.conclusao = response.mensagem;
      execucao.mensagemConclusao = response.mensagem;
    }).catch(() => console.warn('Não foi possivel buscar a conclusão!'));

    this.trackerConclusao.addPromise(promise);
  }

  render() {
    return (
      <div class="execucao">

        <div>
          <button class="btn-user" onClick={this.onClickUser} type="button">Minhas</button>
          <button class="btn-all" onClick={this.onClickAll} type="button">Todas</button>
        </div>


        {!this.isApiIndisponivel && !this.isCarregando && this.execucoes.length > 0 && (

          <div class="execucao__list">

            {this.execucoes && this.execucoes.map((execucao) => {
              return (
                <bth-execucoes-item
                  execucao={execucao}
                  assinadorApi={this.getAssinadorApi()}
                  execucoesApi={this.getExecucoesApi()}
                  consultaApi={this.getConsultaApi()}
                  execucaoId={execucao.id}
                  concluidaEm={execucao.concluidaEm}
                  propriedades={execucao.propriedades}
                  gerouResultado={execucao.gerouResultado}
                  protocolo={execucao.protocolo}
                  artefatoTipo={execucao.artefato?.tipo?.value}
                  statusValor={execucao.status?.value}
                  statusDescricao={execucao.status?.description}
                  conclusaoTipoValor={execucao.conclusao?.tipo?.value}
                  artefatoVersao={execucao.artefato?.versao}
                  visibilidadeValor={execucao.visibilidade?.value}
                  autor={execucao.autor}
                  iniciadaEm={execucao.iniciadaEm}
                  duracaoValor={execucao.duracao?.valor}
                  mensagemConclusao={execucao.mensagemConclusao}>
                </bth-execucoes-item>
              );}
            )}



            <div class="assistente__pagination">
              <button onClick={this.prevPage} disabled={this.paginationControl.offset === 1}>
                <bth-icone icone="chevron-left"></bth-icone>
              </button>
              <button onClick={this.nextPage} disabled={!this.paginationControl.hasNext}>
                <bth-icone icone="chevron-right"></bth-icone>
              </button>
            </div>
          </div>

        )}

        {this.isApiIndisponivel && !this.isCarregando && (
          <div class="execucao__empty">
            <div class="execucao__empty-inconsistency"></div>
            <h4>As execuções estão temporariamente indisponível</h4>
          </div>
        )}

        {!this.isApiIndisponivel && !this.isCarregando && this.execucoes.length == 0 && (
          <div class="execucao__empty">
            <div class="execucao__empty-records"></div>
            <h4>Ainda não há execuções por aqui</h4>
          </div>
        )}

        {this.isCarregando && (
          <bth-loader></bth-loader>
        )}

      </div>
    );
  }

}
