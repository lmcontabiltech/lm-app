import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from './empresa';
import { EmpresasService } from '../../../services/administrativo/empresas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalDeleteService } from 'src/app/services/modal/modalDeletar.service';
import { RegimeDaEmpresa } from './enums/regime-da-empresa';
import { RegimeDaEmpresaDescricao } from './enums/regime-da-empresa-descricao';
import {
  ExportService,
  Header,
} from 'src/app/services/feedback/export.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css'],
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  empresasPaginados: Empresa[] = [];
  itensPorPagina = 6;
  paginaAtual = 1;
  totalPaginas = 0;
  selectedEmpresa: any = null;

  permissaoUsuario: string = '';

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  RegimeDaEmpresaDescricao = RegimeDaEmpresaDescricao;
  selectedRegime: string = '';

  regimes = Object.keys(RegimeDaEmpresa).map((key) => ({
    value: RegimeDaEmpresa[key as keyof typeof RegimeDaEmpresa],
    description:
      RegimeDaEmpresaDescricao[
        RegimeDaEmpresa[key as keyof typeof RegimeDaEmpresa]
      ],
  }));

  unidades = [
    { value: 'MATRIZ', description: 'Matriz' },
    { value: 'FILIAL', description: 'Filial' },
  ];
  selectedUnidade: string = '';

  ordenacaoNome: 'asc' | 'desc' | null = null;

  isExporting = false;

  exportHeaders: Header[] = [
    { key: 'razaoSocial', label: 'Razão social' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'unidadeEmpresa', label: 'Unidade da empresa' },
    { key: 'matriz', label: 'Matriz' },
    { key: 'codQuestor', label: 'Código no questor' },
    { key: 'codEmpDominio', label: 'Código no domínio' },
    { key: 'regimeEmpresa', label: 'Regime da empresa' },
    { key: 'controleParcelamento', label: 'Controle de parcelamento' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'situacao', label: 'Situação' },
    { key: 'estado', label: 'Estado' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'status', label: 'Status' },
  ];

  constructor(
    private router: Router,
    private empresasService: EmpresasService,
    private authService: AuthService,
    private modalDeleteService: ModalDeleteService,
    private exportSvc: ExportService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.fetchEmpresas();
    this.atualizarPaginacao();

    // 🔸 Obter permissão do usuário autenticado
    const usuario = this.authService.getUsuarioAutenticado();
    if (usuario && usuario.permissao) {
      switch (usuario.permissao) {
        case 'ROLE_ADMIN':
          this.permissaoUsuario = 'Administrador';
          break;
        case 'ROLE_COORDENADOR':
          this.permissaoUsuario = 'Coordenador';
          break;
        case 'ROLE_USER':
          this.permissaoUsuario = 'Colaborador';
          break;
        case 'ROLE_ESTAGIARIO':
          this.permissaoUsuario = 'Estagiario';
          break;
        default:
          this.permissaoUsuario = 'Desconhecido';
      }
    }
  }

  cadastrarEmpresa(): void {
    this.router.navigate(['/usuario/cadastro-de-empresa']);
  }

  historicoEmpresa(): void {
    this.router.navigate(['/usuario/historico-empresas-inativas']);
  }

  onSearch(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.mensagemBusca = '';
      this.fetchEmpresas();
      return;
    }
    this.isLoading = true;
    this.empresasService.buscarEmpresasPorNome(searchTerm).subscribe(
      (empresas: Empresa[]) => {
        this.empresas = empresas;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.empresas.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        if (!empresas || empresas.length === 0) {
          this.mensagemBusca = 'Busca não encontrada';
        } else {
          this.mensagemBusca = '';
        }
      },
      (error) => {
        console.error('Erro ao buscar empresas:', error);
        this.isLoading = false;
        if (error.message && error.message.includes('404')) {
          this.empresas = [];
          this.atualizarPaginacao();
          this.mensagemBusca = 'Busca não encontrada';
        }
      }
    );
  }

  fetchEmpresas(): void {
    this.isLoading = true;
    this.empresasService.getEmpresas().subscribe(
      (empresas: Empresa[]) => {
        this.empresas = empresas;
        this.totalPaginas = Math.ceil(
          this.empresas.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar empresas:', error);
        this.isLoading = false;
      }
    );
  }

  getDescricaoRegime(regime: string): string {
    return RegimeDaEmpresaDescricao[regime as RegimeDaEmpresa] || regime;
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.empresasPaginados = this.empresas.slice(inicio, fim);
  }

  get totalItens() {
    return this.empresas.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  deletarEmpresa(id: string): void {
    const empresaRemovida = this.empresas.find((e) => e.id === id);
    this.empresasService.deletarEmpresa(id).subscribe(
      () => {
        this.empresas = this.empresas.filter((empresa) => empresa.id !== id);
        this.totalPaginas = Math.ceil(
          this.empresas.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.showMessage(
          'success',
          `Empresa "${
            empresaRemovida?.razaoSocial || ''
          }" deletada com sucesso!`
        );
      },
      (error: any) => {
        console.error('Erro ao excluir empresa:', error);
      }
    );
  }

  visualizarEmpresa(id: string): void {
    this.router.navigate(['/usuario/detalhes-empresa', id]);
  }

  editarEmpresa(id: string): void {
    this.router.navigate(['/usuario/cadastro-de-empresa', id]);
  }

  openModalDeletar(empresa: any): void {
    this.selectedEmpresa = empresa;

    this.modalDeleteService.openModal(
      {
        title: 'Remoção de Empresa',
        description: `Tem certeza que deseja excluir a empresa <strong>${empresa.razaoSocial}</strong> cadastrada?`,
        item: empresa,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deletarEmpresa(empresa.id);
      }
    );
  }

  exibirMensagemDeSucesso(): void {
    const state = window.history.state as { successMessage?: string };
    if (state?.successMessage) {
      this.successMessage = state.successMessage;
      setTimeout(() => (this.successMessage = ''), 3000);
      window.history.replaceState({}, document.title);
    }
  }

  showMessage(type: 'success' | 'error', msg: string) {
    this.clearMessage();
    if (type === 'success') this.successMessage = msg;
    this.messageTimeout = setTimeout(() => this.clearMessage(), 3000);
  }

  clearMessage() {
    this.successMessage = '';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }

  onRegimeChange(): void {
    const regimes = this.selectedRegime ? [this.selectedRegime] : [];
    this.isLoading = true;
    const obs =
      regimes.length > 0
        ? this.empresasService.getEmpresasPorRegime(regimes[0])
        : this.empresasService.getEmpresas();

    obs.subscribe(
      (empresas) => {
        this.empresas = empresas;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.empresas.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        this.mensagemBusca =
          empresas.length === 0
            ? 'Nenhuma empresa encontrada para o regime selecionado.'
            : '';
      },
      (error) => {
        this.isLoading = false;
        this.mensagemBusca = 'Erro ao buscar empresas por regime.';
        console.error(error);
      }
    );
  }

  onUnidadeChange(): void {
    this.isLoading = true;
    const unidade = this.selectedUnidade;
    const regime = this.selectedRegime;

    let obs;

    if (regime && unidade) {
      obs = this.empresasService.getEmpresasPorRegime(regime, unidade);
    } else if (regime) {
      obs = this.empresasService.getEmpresasPorRegime(regime);
    } else if (unidade) {
      obs = this.empresasService.getEmpresasPorRegime('', unidade);
    } else {
      obs = this.empresasService.getEmpresas();
    }

    obs.subscribe(
      (empresas) => {
        this.empresas = empresas;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.empresas.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        this.mensagemBusca =
          empresas.length === 0
            ? 'Nenhuma empresa encontrada para o filtro selecionado.'
            : '';
      },
      (error) => {
        this.isLoading = false;
        this.mensagemBusca = 'Erro ao buscar empresas.';
        console.error(error);
      }
    );
  }

  alternarOrdenacaoNome() {
    if (this.ordenacaoNome === 'asc') {
      this.ordenacaoNome = 'desc';
    } else {
      this.ordenacaoNome = 'asc';
    }
    this.empresas.sort((a, b) => {
      const nomeA = a.razaoSocial.toLowerCase();
      const nomeB = b.razaoSocial.toLowerCase();
      if (this.ordenacaoNome === 'asc') {
        return nomeA.localeCompare(nomeB);
      } else {
        return nomeB.localeCompare(nomeA);
      }
    });
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  exportCsv() {
    this.isExporting = true;
    const data = this.empresas;

    if (!data?.length) {
      this.showMessage('error', 'Nada para exportar com o setor atual.');
      this.isExporting = false;
      return;
    }

    const rows = this.mapForExport(data);
    this.exportSvc.toCsv(
      `empresas${this.selectedRegime ? '_' + this.selectedRegime : ''}${
        this.selectedUnidade ? '_' + this.selectedUnidade : ''
      }`,
      rows,
      this.exportHeaders
    );

    this.isExporting = false;
  }

  private mapForExport(rows: any[]) {
    return rows.map((r) => ({
      razaoSocial: r.razaoSocial ?? '',
      cnpj: r.cnpj ?? '',
      codQuestor: r.codQuestor ?? '',
      codEmpDominio: r.codEmpDominio ?? '',
      unidadeEmpresa: r.unidadeEmpresa ?? '',
      matriz: r.matriz?.razaoSocial ?? '',
      regimeEmpresa: this.getDescricaoRegime(r.regimeEmpresa) ?? '',
      controleParcelamento: r.controleParcelamento ?? '',
      situacao: r.situacao ?? '',
      tipo: r.tipo ?? '',
      estado: r.estado ?? '',
      cidade: r.cidade ?? '',
      status: r.status
        ? r.status.toUpperCase() === 'ATIVO'
          ? 'Ativo'
          : 'Inativo'
        : r.ativo === true
        ? 'Ativo'
        : r.ativo === false
        ? 'Inativo'
        : '',
    }));
  }
}
