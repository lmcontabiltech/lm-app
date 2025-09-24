import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Periferico } from './periferico';
import { PerifericoService } from 'src/app/services/administrativo/periferico.service';
import { AuthService } from 'src/app/services/auth.service';
import { Setor } from '../cadastro-de-colaborador/setor';
import { SetorDescricao } from '../cadastro-de-colaborador/setor-descricao';
import { ModalDeleteService } from 'src/app/services/modal/modalDeletar.service';

@Component({
  selector: 'app-perifericos',
  templateUrl: './perifericos.component.html',
  styleUrls: ['./perifericos.component.css'],
})
export class PerifericosComponent implements OnInit {
  perifericos: Periferico[] = [];
  perifericosPaginados: Periferico[] = [];
  itensPorPagina = 6;
  paginaAtual = 1;
  totalPaginas = 0;
  selectedPeriferico: any = null;

  permissaoUsuario: string = '';

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  selectedSetor: string = '';
  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  constructor(
    private router: Router,
    private perifericoService: PerifericoService,
    private authService: AuthService,
    private modalDeleteService: ModalDeleteService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.fetchPerifericos();
    this.atualizarPaginacao();

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

  cadastrarPeriferico(): void {
    this.router.navigate(['/usuario/cadastro-de-perifericos']);
  }

  onSearch(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.mensagemBusca = '';
      this.fetchPerifericos();
      return;
    }
    this.isLoading = true;
    this.perifericoService.buscarPerifericosPorNome(searchTerm).subscribe(
      (perifericos: Periferico[]) => {
        this.perifericos = perifericos;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.perifericos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        if (!perifericos || perifericos.length === 0) {
          this.mensagemBusca = 'Busca não encontrada';
        } else {
          this.mensagemBusca = '';
        }
      },
      (error) => {
        console.error('Erro ao buscar empresas:', error);
        this.isLoading = false;
        if (error.message && error.message.includes('404')) {
          this.perifericos = [];
          this.atualizarPaginacao();
          this.mensagemBusca = 'Busca não encontrada';
        }
      }
    );
  }

  fetchPerifericos(): void {
    this.isLoading = true;
    this.perifericoService.getPeriferico().subscribe(
      (perifericos: Periferico[]) => {
        this.perifericos = perifericos;
        this.totalPaginas = Math.ceil(
          this.perifericos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar perifericos:', error);
        this.isLoading = false;
      }
    );
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.perifericosPaginados = this.perifericos.slice(inicio, fim);
  }

  get totalItens() {
    return this.perifericos.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  deletarPeriferico(id: string): void {
    const perifericoRemovido = this.perifericos.find((e) => e.id === id);
    this.perifericoService.deletarPeriferico(id).subscribe(
      () => {
        this.perifericos = this.perifericos.filter(
          (periferico) => periferico.id !== id
        );
        this.totalPaginas = Math.ceil(
          this.perifericos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.showMessage(
          'success',
          `Periférico "${perifericoRemovido?.nome || ''}" deletado com sucesso!`
        );
      },
      (error: any) => {
        console.error('Erro ao excluir periférico:', error);
      }
    );
  }

  openModalDeletar(periferico: any): void {
    this.selectedPeriferico = periferico;

    this.modalDeleteService.openModal(
      {
        title: 'Remoção de Periférico',
        description: `Tem certeza que deseja excluir o periférico <strong>${periferico.nome}</strong> cadastrado?`,
        item: periferico,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deletarPeriferico(periferico.id);
      }
    );
  }

  editarPeriferico(id: string): void {
    this.router.navigate(['/usuario/cadastro-de-perifericos', id]);
  }

  visualizarPeriferico(id: string): void {
    this.router.navigate(['/usuario/detalhes-periferico', id]);
  }

  getSetorEnum(estacao: string): Setor | 'ALL' {
    return (Setor as any)[estacao] || estacao;
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

  onEstacaoChange() {
    const setor = this.selectedSetor || '';
    console.log('Setor selecionado:', setor);
    this.isLoading = true;
    this.perifericoService.filtroPerifericosPorSetor(setor).subscribe(
      (perifericos) => {
        console.log('Periféricos retornados pelo backend:', perifericos);
        this.perifericos = perifericos;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.perifericos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        this.mensagemBusca =
          perifericos.length === 0
            ? 'Nenhum periférico encontrado para o setor selecionado.'
            : '';
      },
      (error) => {
        this.isLoading = false;
        this.mensagemBusca = 'Erro ao buscar periféricos por setor.';
        console.error(error);
      }
    );
  }
}
