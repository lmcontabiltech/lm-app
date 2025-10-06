import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Colaborador } from 'src/app/sistema/administrativo/colaboradores/colaborador';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor-descricao';
import { ColaboradoresService } from '../../../../services/administrativo/colaboradores.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  ScannerService,
  ScannerResponse,
} from 'src/app/services/gerenciamento/scanner.service';
import { ScannerRunResponseDTO } from '../../scanner/scanner';
import { Empresa } from 'src/app/sistema/administrativo/empresas/empresa';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';

@Component({
  selector: 'app-historico-scanner',
  templateUrl: './historico-scanner.component.html',
  styleUrls: ['./historico-scanner.component.css'],
})
export class HistoricoScannerComponent implements OnInit {
  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  execucoes: ScannerRunResponseDTO[] = [];
  itensPorPagina = 6;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.execucoes.length / this.itensPorPagina);
  execucoesPaginadas: ScannerRunResponseDTO[] = [];

  permissaoUsuario: string = '';

  selectedSetor: string = '';
  showModalDeletar: boolean = false;
  selectedColaborador: any = null;

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  empresas: { value: string; description: string }[] = [];
  selectedEmpresa: string = '';

  constructor(
    private router: Router,
    private colaboradoresService: ColaboradoresService,
    private authService: AuthService,
    private location: Location,
    private scannerService: ScannerService,
    private empresasService: EmpresasService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.fetchExecucoes();
    this.atualizarPaginacao();
    this.carregarEmpresas();

    const usuario = this.authService.getUsuarioAutenticado();
    if (usuario?.permissao) {
      this.permissaoUsuario = this.mapPermissao(usuario.permissao);
    }
  }

  private mapPermissao(permissao: string): string {
    switch (permissao) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_COORDENADOR':
        return 'Coordenador';
      case 'ROLE_USER':
        return 'Colaborador';
      default:
        return 'Desconhecido';
    }
  }

  goBack() {
    this.location.back();
  }

  visualizarAnalise(id: string): void {
    this.router.navigate(['/usuario/detalhes-analise', id]);
  }

  onSearch(searchTerm: string) {}

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.execucoesPaginadas = this.execucoes.slice(inicio, fim);
  }

  get totalItens() {
    return this.execucoes.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  fetchExecucoes(): void {
    this.isLoading = true;
    this.scannerService.listarExecucoesScanner().subscribe({
      next: (response: ScannerRunResponseDTO[]) => {
        this.execucoes = response;
        this.totalPaginas = Math.ceil(
          this.execucoes.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        console.log('Execuções carregadas:', this.execucoes);
      },
      error: (error) => {
        console.error('Erro ao buscar execuções:', error);
        this.isLoading = false;
      },
    });
  }

  editarColaborador(id: string): void {
    this.router.navigate(['/usuario/cadastro-de-colaborador', id]);
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRandomColor(seed: string): string {
    const colors = [
      '#FFB3BA', // Rosa pastel
      '#FFDFBA', // Laranja pastel
      '#BAFFC9', // Verde pastel
      '#BAE1FF', // Azul pastel
      '#D5BAFF', // Roxo pastel
    ];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
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

  onEmpresaChange() {
    if (!this.selectedEmpresa) {
      this.fetchExecucoes();
      return;
    }

    this.isLoading = true;
    this.scannerService
      .listarExecucoesScannerPorEmpresa(this.selectedEmpresa)
      .subscribe(
        (execucoes) => {
          this.execucoes = execucoes;
          this.paginaAtual = 1;
          this.totalPaginas = Math.ceil(
            this.execucoes.length / this.itensPorPagina
          );
          this.atualizarPaginacao();
          this.isLoading = false;
          this.mensagemBusca =
            this.execucoes.length === 0
              ? 'Nenhuma análise encontrada para a empresa selecionada.'
              : '';
        },
        (error) => {
          this.isLoading = false;
          this.mensagemBusca = 'Erro ao buscar histórico por empresa.';
          console.error(error);
        }
      );
  }

  carregarEmpresas(callback?: () => void): void {
    this.empresasService.getEmpresas().subscribe(
      (empresas) => {
        this.empresas = empresas.map((empresa) => ({
          value: empresa.id,
          description: empresa.razaoSocial,
        }));
      },
      (error) => {
        console.error('Erro ao carregar as empresas:', error);
        if (callback) callback();
      }
    );
  }

  atualizarEmpresas(): void {
    console.log('Atualizando lista de empresas...');
    this.carregarEmpresas();
  }
}
