import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Colaborador } from './colaborador';
import { Setor } from '../cadastro-de-colaborador/setor';
import { SetorDescricao } from '../cadastro-de-colaborador/setor-descricao';
import { ColaboradoresService } from '../../../services/administrativo/colaboradores.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal/modalDeletar.service';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css'],
})
export class ColaboradoresComponent implements OnInit {
  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  colaboradores: Colaborador[] = [];
  itensPorPagina = 6;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.colaboradores.length / this.itensPorPagina);
  colaboradoresPaginados: Colaborador[] = [];

  permissaoUsuario: string = '';

  selectedSetor: string = '';
  showModalDeletar: boolean = false;
  selectedColaborador: any = null;

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  constructor(
    private router: Router,
    private colaboradoresService: ColaboradoresService,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.fetchColaboradores();
    this.atualizarPaginacao();

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

  cadastrarColaborador(): void {
    this.router.navigate(['/usuario/cadastro-de-colaborador']);
  }

  onSearch(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.mensagemBusca = '';
      this.fetchColaboradores();
      return;
    }
    this.isLoading = true;
    this.colaboradoresService.buscarUsuariosPorNome(searchTerm).subscribe(
      (colaboradores: Colaborador[]) => {
        this.colaboradores = colaboradores;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.colaboradores.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        if (!colaboradores || colaboradores.length === 0) {
          this.mensagemBusca = 'Busca não encontrada';
        } else {
          this.mensagemBusca = '';
        }
      },
      (error) => {
        console.error('Erro ao buscar colaboradores:', error);
        this.isLoading = false;
        if (error.message && error.message.includes('404')) {
          this.colaboradores = [];
          this.atualizarPaginacao();
          this.mensagemBusca = 'Busca não encontrada';
        }
      }
    );
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.colaboradoresPaginados = this.colaboradores.slice(inicio, fim);
  }

  get totalItens() {
    return this.colaboradores.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  fetchColaboradores(): void {
    this.isLoading = true;
    this.colaboradoresService.getUsuariosNonAdmin().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response;
        this.totalPaginas = Math.ceil(
          this.colaboradores.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao buscar colaboradores:', error);
        this.isLoading = false;
      }
    );
  }

  deleteColaborador(id: string): void {
    const colaboradorRemovido = this.colaboradores.find((e) => e.id === id);
    this.colaboradoresService.deleteUsuarioById(id).subscribe(
      () => {
        this.colaboradores = this.colaboradores.filter(
          (colaborador) => colaborador.id !== id
        );
        this.totalPaginas = Math.ceil(
          this.colaboradores.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.showMessage(
          'success',
          `Usuário "${colaboradorRemovido?.nome || ''}" deletado com sucesso!`
        );
      },
      (error: any) => {
        this.showMessage('error', 'Erro ao excluir colaborador.');
      }
    );
  }

  openModalDeletar(colaborador: any): void {
    this.selectedColaborador = colaborador;

    this.modalService.openModal(
      {
        title: 'Remoção de Usuário',
        description: `Tem certeza que deseja excluir o(a) colaborador(a) <strong>${colaborador.nome}</strong>?`,
        item: colaborador,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deleteColaborador(colaborador.id);
      }
    );
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

  onSetorChange() {
    const setores = this.selectedSetor ? [this.selectedSetor] : [];
    this.isLoading = true;
    this.colaboradoresService.FiltroUsuariosBySetores(setores).subscribe(
      (usuarios) => {
        this.colaboradores = usuarios;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.colaboradores.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        this.mensagemBusca =
          usuarios.length === 0
            ? 'Nenhum usuário encontrado para o setor selecionado.'
            : '';
      },
      (error) => {
        this.isLoading = false;
        this.mensagemBusca = 'Erro ao buscar usuários por setor.';
        console.error(error);
      }
    );
  }
}
