import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Periferico } from './periferico';
import { PerifericoService } from 'src/app/services/administrativo/periferico.service';
import { AuthService } from 'src/app/services/auth.service';
import { Setor } from '../cadastro-de-colaborador/setor';

@Component({
  selector: 'app-perifericos',
  templateUrl: './perifericos.component.html',
  styleUrls: ['./perifericos.component.css'],
})
export class PerifericosComponent implements OnInit {
  perifericos: Periferico[] = [];
  perifericosPaginados: Periferico[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = 0;

  permissaoUsuario: string = '';

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  constructor(
    private router: Router,
    private perifericoService: PerifericoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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
    this.perifericoService.getPeriferico().subscribe(
      (perifericos: Periferico[]) => {
        this.perifericos = perifericos;
        this.totalPaginas = Math.ceil(
          this.perifericos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
      },
      (error) => {
        console.error('Erro ao carregar perifericos:', error);
      }
    );
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.perifericosPaginados = this.perifericos.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  deletarPeriferico(id: string): void {
    if (confirm('Tem certeza que deseja excluir este periferico?')) {
      this.perifericoService.deletarPeriferico(id).subscribe(
        () => {
          this.perifericos = this.perifericos.filter(
            (periferico) => periferico.id !== id
          );
          this.totalPaginas = Math.ceil(
            this.perifericos.length / this.itensPorPagina
          );
          this.atualizarPaginacao();
        },
        (error: any) => {
          console.error('Erro ao excluir periferico:', error);
        }
      );
    }
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
}
