import { Component, Host, Listen, State, h, Prop, Watch, Element, ComponentInterface } from '@stencil/core';

import { isValidAuthorizationConfig } from '../../global/api';
import { AuthorizationConfig } from '../../global/interfaces';
import { isNill } from '../../utils/functions';
import { PromiseTracker } from '../../utils/promise-tracker';
import { TipoExtensao, OpcaoFiltro, PaginationParams, TipoVisualizacao} from './assistente.interfaces';
import { AssistenteService } from './assistente.service';


@Component({
  tag: 'bth-assistente',
  styleUrl: 'assistente.scss',
  shadow: true,
})

export class BthAssistente implements ComponentInterface {

  private assistenteService: AssistenteService;

  private tracker = new PromiseTracker((active: boolean) => {
    this.isCarregando = active;
  });

  private trackerTags = new PromiseTracker((active: boolean) => {
    this.isCarregandoTags = active;
  });

  private trackerFavoritos = new PromiseTracker((active: boolean) => {
    this.isCarregandoFavoritos = active;
  });

  private paginationControl: any = { offset: 1, limit: 15, hasNext: false };

  private VerTodasTags = 'Ver todas as tags';

  private icones = {
    [TipoExtensao.relatorio]: 'file-multiple-outline',
    [TipoExtensao.script]: 'code-tags',
    [TipoExtensao.all]: 'star',
    [TipoVisualizacao.lista]: 'format-list-bulleted',
    [TipoVisualizacao.pasta]: 'folder'
  };

  @Element() el!: HTMLBthAssistenteElement;

  @State() isApiIndisponivel: boolean = false;
  @State() isCarregando: boolean = false;
  @State() isCarregandoTags: boolean = false;
  @State() isCarregandoFavoritos: boolean = false;

  @State() termoBusca: string;

  @State() extensoes: Array<any> = [];
  @State() tags: Array<any> = [];

  @State() filtros: Array<OpcaoFiltro> = [
    { id: TipoExtensao.relatorio, icone: this.icones[TipoExtensao.relatorio], descricao: 'Relatórios', ativo: true },
    { id: TipoExtensao.script, icone: this.icones[TipoExtensao.script], descricao: 'Scripts', ativo: false },
    { id: TipoExtensao.all, icone: this.icones[TipoExtensao.all], descricao: 'Favoritos', ativo: false },
  ]

  @State() visualizacao: Array<OpcaoFiltro> = [
    { id: TipoVisualizacao.lista, icone: this.icones[TipoVisualizacao.lista], descricao: 'Lista', ativo: true },
    { id: TipoVisualizacao.pasta, icone: this.icones[TipoVisualizacao.pasta], descricao: 'Pasta', ativo: false },
  ]

  /**
  * Configuração de autorização. É necessária para o componente poder realizar autentizar com os serviços.
  */
  @Prop() readonly authorization: AuthorizationConfig;

  /**
  * URL para a api de notificações. Por padrão irá obter do env.js
  */
  @Prop() readonly assistenteApi?: string;


  @Listen('navbarPillItemClicked')
  onNavbarPillItemClicked(data: CustomEvent): void {
    const { identificador } = data.detail;

    if(TipoExtensao[identificador.toLowerCase()]){
      this.setOpcaoFiltroAtivo(identificador);
    }

    if(TipoVisualizacao[identificador.toLowerCase()]){
      this.setOpcaoVisualizacaoAtivo(identificador);
    }

  }

  @Listen('tagClicked')
  onTagClicked(data: CustomEvent): void {
    const { identificador } = data.detail;
    this.setOpcaoTagAtiva(identificador);
  }

  @Listen('favClicked')
  onFavClicked(data: CustomEvent): void {
    const { identificador } = data.detail;
    this.setFavorito(identificador);
  }

  @Listen('buscaSubmit')
  onBuscaSubmit(data: CustomEvent): void {
    const { termo } = data.detail;
    this.termoBusca = termo;
    this.resetPagination();
    this.getExtensoes();
  }

  @Watch('authorization')
  @Watch('assistenteApi')
  onChangeApiRelatedProperties(): void {
    this.inicializarServices();
  }

  connectedCallback() {
    this.inicializarServices();
    this.loadFiltros();
  }

  private inicializarServices() {
    if (this.isConfiguracaoApiInconsistente()) {
      console.warn('[bth-assistente] O endereço do serviço de extensões e as credenciais de autenticação devem ser informados. Consulte a documentação do componente.');
      this.isApiIndisponivel = true;
      return;
    }

    this.isApiIndisponivel = false;
    this.assistenteService = new AssistenteService(this.authorization, this.getAssitenteApi());

  }

  private isConfiguracaoApiInconsistente() {
    if (isNill(this.getAssitenteApi())) {
      return true;
    }

    if (!isValidAuthorizationConfig(this.authorization)) {
      return true;
    }

    return false;
  }

  private getAssitenteApi(): string {

    if (!isNill(this.assistenteApi)) {
      return this.assistenteApi;
    }

    if ('___bth' in window) {
      return window['___bth']?.envs?.suite?.['plataforma-extensoes']?.v1?.host;
    }

    return null;
  }





  private getParams() {

    const filtroAtivo = this.getOpcaoFiltroAtivo();
    const tagAtiva = this.getOpcaoTagAtiva();
    const filter: Array<any> = [];

    if (filtroAtivo.id !== TipoExtensao.all) {
      filter.push(`tipo = '${filtroAtivo.id}'`);
    }

    if (filtroAtivo.id === TipoExtensao.all) {
      filter.push('favorita = true');
    }

    if (filtroAtivo?.id === TipoExtensao.script) {
      filter.push('propriedades = new Propriedade(\'tipoScript\', \'JOB\')');
    }

    if (tagAtiva) {
      filter.push(`tagsE in (new Tag('${tagAtiva.rotulo}'))`);
    }

    filter.push('propriedades = new Propriedade(\'disponivelConsulta\', \'true\')');

    if (!isNill(this.termoBusca)) {
      filter.push(`(titulo like ${encodeURIComponent('\'%' + this.termoBusca + '%\'')})`);
    }

    return filter.join(' and ');

  }

  private getExtensoes() {

    const paginationParams: PaginationParams = {
      'offset': (this.paginationControl.offset - 1) * this.paginationControl.limit,
      'limit': this.paginationControl.limit.toString(),
      'sort': 'atualizadoEm desc', //"titulo asc",
      'filter': this.getParams()
    };

    const promise = this.assistenteService.extensoes(paginationParams)
      .then(extensoes => {
        this.isApiIndisponivel = false;
        this.extensoes = extensoes.content;
        this.paginationControl.hasNext = extensoes.hasNext;
      })
      .catch(() => this.isApiIndisponivel = true);

    this.tracker.addPromise(promise);

  }

  private getTags() {

    const todas = this.getOpcaoTagAtiva()?.rotulo === this.VerTodasTags || this.getOpcaoVisualizacaoAtivo()?.id === TipoVisualizacao.pasta;

    const paginationParams: PaginationParams = {
      'offset': 0,
      'limit': todas ? 999 : 16,
      'sort': 'rotulo asc',
      'filter': this.getOpcaoFiltroAtivo().id
    };

    const promise = this.assistenteService.tags(paginationParams)
      .then(tags => {
        this.isApiIndisponivel = false;
        this.tags = tags.content;

        if (this.getOpcaoVisualizacaoAtivo().id === TipoVisualizacao.pasta) {
          this.tags = this.tags.map(tag => {
            tag.pasta = true;
            return tag;
          });
        }

        if (tags.hasNext) {
          this.tags.push({ rotulo: this.VerTodasTags, link: true });
        }
      })
      .catch(() => this.isApiIndisponivel = true);

    this.trackerTags.addPromise(promise);

  }

  private setFavorito(identificador: string) {

    if (this.isCarregandoFavoritos) return;

    const extensao = this.extensoes.find(e => e.id === identificador);
    const promise = this.assistenteService.favorito(extensao.tipo, extensao.referencia.id, extensao.favorita)
      .then(() => extensao.favorita = !extensao.favorita)
      .catch(() => console.log('Erro ao favoritar'));

    this.trackerFavoritos.addPromise(promise);

  }

  private loadFiltros() {

    this.tags = [];
    this.extensoes = [];
    this.resetPagination();

    if (!this.isFiltroFavoritos()) {
      this.getTags();
    }
    
    if (!this.isVisualizacaoPastas()) {
      this.getExtensoes();
    }
    
  }

  private getOpcaoFiltroAtivo(): OpcaoFiltro {
    return this.filtros.filter(filtro => filtro.ativo === true)[0];
  }

  private setOpcaoFiltroAtivo(id: string) {
    this.filtros = this.filtros.map(_filtro => {
      _filtro.ativo = _filtro.id === id;
      return _filtro;
    });

    this.loadFiltros();
  }

  private getOpcaoVisualizacaoAtivo(): OpcaoFiltro {
    return this.visualizacao.filter(filtro => filtro.ativo === true)[0];
  }

  private setOpcaoVisualizacaoAtivo(id: string) {
    this.visualizacao = this.visualizacao.map(_v => {
      _v.ativo = _v.id === id;
      return _v;
    });

    this.loadFiltros();
  }



  private getOpcaoTagAtiva() {
    return this.tags.filter(tag => tag.ativo === true)[0];
  }

  private setOpcaoTagAtiva(rotulo: string) {

    this.tags = this.tags.map(tag => {
      tag.ativo = tag.ativo ? false : tag.rotulo === rotulo;
      return tag;
    });

    if (rotulo === this.VerTodasTags) {
      this.getTags();
      return;
    }

    this.resetPagination();
    this.getExtensoes();
  }

  private isFiltroFavoritos(): boolean {
    return this.getOpcaoFiltroAtivo().id === TipoExtensao.all;
  }
  
  private isVisualizacaoPastas(): boolean {
    return this.getOpcaoVisualizacaoAtivo().id === TipoVisualizacao.pasta;
  }
  
  private isPastaSelected(): boolean {
    return this.isVisualizacaoPastas() && this.getOpcaoTagAtiva();
  }

  private resetPagination() {
    this.paginationControl.offset = 1;
  }

  private nextPage = () => {
    
    if (!this.paginationControl.hasNext) return;

    this.paginationControl.offset++;
    this.getExtensoes();
  }

  private prevPage = () => {
    
    if (this.paginationControl.offset === 1) return;

    this.paginationControl.offset--;
    this.getExtensoes();
  }


  render() {
    return (
      <Host>
        <div class="assistente">

          <div class="assistente__header">

            <bth-busca delay={600}></bth-busca>

            <div class="assistente__filtros">
              <bth-navbar-pill-group descricao="Filtros">
                {this.filtros.map(filtro => (
                  <bth-navbar-pill-item
                    key={filtro.id.toString()}
                    identificador={filtro.id.toString()}
                    icone={filtro.icone}
                    descricao={filtro.descricao}
                    show-descricao
                    ativo={filtro.ativo}>
                  </bth-navbar-pill-item>
                ))}
              </bth-navbar-pill-group>
              <bth-navbar-pill-group descricao="Visualização">
                {this.visualizacao.map(v => (
                  <bth-navbar-pill-item
                    key={v.id.toString()}
                    identificador={v.id.toString()}
                    icone={v.icone}
                    descricao={v.descricao}
                    show-descricao
                    ativo={v.ativo}>
                  </bth-navbar-pill-item>
                ))}
              </bth-navbar-pill-group>
            </div>

            <div class={{ 'assistente__tags': true, 'pasta-selected': this.isPastaSelected() }}>
              {!this.isCarregandoTags && this.tags && this.tags.map(tag => (
                <bth-assistente-tag
                  descricao={tag.rotulo}
                  ativo={tag.ativo}
                  pasta={tag.pasta}
                  link={tag.link}>
                </bth-assistente-tag>
              ))}
            </div>
          </div>

          {!this.isApiIndisponivel && !this.isCarregando && this.extensoes.length > 0 && (

            <div class="assistente__list">

              {this.extensoes.map(extensao => (
                <bth-assistente-item
                  identificador={extensao.id}
                  descricao={extensao.titulo}
                  icone={this.icones[extensao.tipo]}
                  favorito={extensao.favorita}
                  tags={extensao.tags}>
                </bth-assistente-item>
              ))}

              <div class="assistente__pagination">
                <button onClick={this.prevPage} disabled={this.paginationControl.offset === 1}>
                  <bth-icone icone="chevron-left"></bth-icone> Anterior
                </button>
                <button onClick={this.nextPage} disabled={!this.paginationControl.hasNext}>
                  Próxima <bth-icone icone="chevron-right"></bth-icone>
                </button>
              </div>

            </div>

          )}

          {this.isApiIndisponivel && !this.isCarregando && (
            <div class="assistente__empty">
              <div class="assistente__empty-inconsistency"></div>
              <h4>O assistente está temporariamente indisponível</h4>
            </div>
          )}

          {this.isCarregando && (
            <bth-loader></bth-loader>
          )}

        </div>
      </Host>
    );
  }

}
