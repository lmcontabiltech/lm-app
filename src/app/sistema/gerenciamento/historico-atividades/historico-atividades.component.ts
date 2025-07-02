import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { HistoricoAtividade } from './historico';
import { AuthService } from 'src/app/services/auth.service';
import { AtividadeService } from 'src/app/services/gerenciamento/atividade.service';
import { ModalAtividadeService } from 'src/app/services/modal/modalAtividade.service';
import { Atividade } from '../atividades/atividades';

@Component({
  selector: 'app-historico-atividades',
  templateUrl: './historico-atividades.component.html',
  styleUrls: ['./historico-atividades.component.css'],
})
export class HistoricoAtividadesComponent implements OnInit {
  historico: HistoricoAtividade[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.historico.length / this.itensPorPagina);
  historicoPaginado: HistoricoAtividade[] = [];
  selectedProcesso: any = null;
  isLoading = false;
  termoBusca: string = '';
  mensagemBusca: string = '';
  errorMessage: string = '';

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  selectedSetor: string = '';

  constructor(
    private router: Router,
    private atividadeService: AtividadeService,
    private au: AuthService,
    private modalAtividadeService: ModalAtividadeService
  ) {}

  ngOnInit(): void {
    this.carregarHistoricoUsuario();
    this.atualizarPaginacao();
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.historicoPaginado = this.historico.slice(inicio, fim);
  }

  get totalItens() {
    return this.historico.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  visualizarAtividade(id: string): void {
    this.router.navigate(['/usuario/detalhes-atividade', id]);
  }

  onSetorChange() {
    this.carregarHistoricoUsuario();
  }

  carregarHistoricoUsuario(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Primeiro, obtém o perfil do usuário logado para pegar o ID
    this.au.obterPerfilUsuario().subscribe({
      next: (usuario) => {
        // Com o ID do usuário, busca o histórico de atividades
        this.atividadeService
          .getHistoricoAtividadesPorUsuario(Number(usuario.id))
          .subscribe({
            next: (historico) => {
              this.historico = historico;
              this.totalPaginas = Math.ceil(
                this.historico.length / this.itensPorPagina
              );
              this.atualizarPaginacao();
              this.isLoading = false;
            },
            error: (error) => {
              this.errorMessage =
                error.message || 'Erro ao buscar histórico de atividades.';
              this.isLoading = false;
              console.error('Erro ao buscar histórico:', error);
            },
          });
      },
      error: (error) => {
        this.errorMessage = 'Erro ao obter dados do usuário.';
        this.isLoading = false;
        console.error('Erro ao obter perfil do usuário:', error);
      },
    });
  }

  recarregarHistorico(): void {
    this.carregarHistoricoUsuario();
  }

  abrirModalAtividade(historicoId: string | undefined): void {
    if (!historicoId) return;

    const historicoItem = this.historico.find((h) => h.id === historicoId);

    if (historicoItem && historicoItem.atividade) {
      this.modalAtividadeService.openModal({
        atividade: historicoItem.atividade,
        size: 'lg',
      });
    } else {
      console.error('Atividade não encontrada no histórico');
    }
  }
}
