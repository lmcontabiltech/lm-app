import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Notificacao } from './notificacao';
import { Setor } from '../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../administrativo/cadastro-de-colaborador/setor-descricao';
import { NotificacaoService } from 'src/app/services/feedback/notificacao.service';
import { FeedbackComponent } from 'src/app/shared/feedback/feedback.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ModalPadraoService } from 'src/app/services/modal/modalConfirmacao.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificacoesComponent implements OnInit, OnDestroy {
  @ViewChild(FeedbackComponent) feedbackComponent!: FeedbackComponent;

  notificacoes: Notificacao[] = [];
  notificacoesFiltradas: Notificacao[] = [];
  notificacoesPaginadas: Notificacao[] = [];

  isLoading = false;
  isMarkingAsRead: { [key: number]: boolean } = {};
  isMarkingAllAsRead = false;

  itensPorPagina = 10;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.notificacoes.length / this.itensPorPagina);

  searchTerm = '';
  selectedSetor: string = '';
  filtroLidas: string = 'todas';

  contadorNaoLidas = 0;
  selectedNotificacao: any = null;

  // SSE Subscription
  private sseSubscription?: Subscription;

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  statusOptions = [
    { value: 'todas', description: 'Todas as notificações' },
    { value: 'naoLidas', description: 'Não lidas' },
    { value: 'lidas', description: 'Lidas' },
  ];

  statusLabels: { [key: string]: string } = {
    A_FAZER: 'A fazer',
    EM_PROGRESSO: 'Em andamento',
    REVISAO: 'Revisão',
    CONCLUIDO: 'Concluído',
  };

  constructor(
    private notificacaoService: NotificacaoService,
    private sanitizer: DomSanitizer,
    private modalPadraoService: ModalPadraoService
  ) {}

  ngOnInit(): void {
    this.carregarNotificacoes();
    this.carregarContadorNaoLidas();
    this.conectarNotificacoesTempoReal();
  }

  ngOnDestroy(): void {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
  }

  carregarNotificacoes(): void {
    this.isLoading = true;

    this.notificacaoService.getNotificacoes().subscribe({
      next: (notificacoes: Notificacao[]) => {
        console.log('Notificações carregadas:', notificacoes);
        this.notificacoes = notificacoes;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar notificações:', error);
        this.showFeedback('error', 'Erro ao carregar notificações');
        this.isLoading = false;
      },
    });
  }

  carregarContadorNaoLidas(): void {
    this.notificacaoService.getContadorNaoLidas().subscribe({
      next: (contador) => {
        this.contadorNaoLidas = contador;
      },
      error: (error) => {
        console.error('Erro ao carregar contador:', error);
      },
    });
  }

  marcarComoLida(notificacao: Notificacao): void {
    if (
      notificacao.lida ||
      !notificacao.id ||
      this.isMarkingAsRead[notificacao.id]
    ) {
      return;
    }

    this.isMarkingAsRead[notificacao.id] = true;

    this.notificacaoService.marcarComoLida(notificacao.id).subscribe({
      next: () => {
        console.log('Notificação marcada como lida:', notificacao.id);
        notificacao.lida = true;
        this.carregarContadorNaoLidas();
        this.aplicarFiltros();
        this.isMarkingAsRead[notificacao.id] = false;
      },
      error: (error) => {
        console.error('Erro ao marcar notificação como lida:', error);
        this.showFeedback('error', 'Erro ao marcar notificação como lida');
        this.isMarkingAsRead[notificacao.id] = false;
      },
    });
  }

  marcarTodasComoLidas(): void {
    if (this.isMarkingAllAsRead || this.contadorNaoLidas === 0) {
      return;
    }

    this.isMarkingAllAsRead = true;

    this.notificacaoService.marcarTodasComoLidas().subscribe({
      next: (quantidadeMarcadas: number) => {
        console.log(`${quantidadeMarcadas} notificações marcadas como lidas`);

        // Marcar todas como lidas localmente
        this.notificacoes.forEach((notificacao) => {
          notificacao.lida = true;
        });

        this.carregarContadorNaoLidas();
        this.aplicarFiltros();

        if (quantidadeMarcadas > 0) {
          this.showFeedback(
            'success',
            `${quantidadeMarcadas} notificação${
              quantidadeMarcadas > 1 ? 'ões' : ''
            } marcada${quantidadeMarcadas > 1 ? 's' : ''} como lida${
              quantidadeMarcadas > 1 ? 's' : ''
            }!`
          );
        } else {
          this.showFeedback('info', 'Todas as notificações já estavam lidas');
        }

        this.isMarkingAllAsRead = false;
      },
      error: (error) => {
        console.error(
          'Erro ao marcar todas as notificações como lidas:',
          error
        );
        this.showFeedback(
          'error',
          'Erro ao marcar todas as notificações como lidas'
        );
        this.isMarkingAllAsRead = false;
      },
    });
  }

  openModalConfirmacao(): void {
    this.modalPadraoService.openModal(
      {
        title: 'Marca as notificações',
        description: `Tem certeza que deseja marcar todas as notificações como lidas?`,
        confirmTextoBotao: 'Confirmar',
        size: 'md',
      },
      () => {
        this.marcarTodasComoLidas();
      }
    );
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.notificacoesPaginadas = this.notificacoesFiltradas.slice(inicio, fim);
  }

  get totalItens() {
    return this.notificacoesFiltradas.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.paginaAtual = 1;
    this.aplicarFiltros();
  }

  onSetorChange(): void {
    this.paginaAtual = 1;
    this.aplicarFiltros();
  }

  onFiltroLidasChange(): void {
    this.paginaAtual = 1;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let notificacoesFiltradas = [...this.notificacoes];

    if (this.searchTerm) {
      notificacoesFiltradas = notificacoesFiltradas.filter(
        (notificacao) =>
          notificacao.titulo?.toLowerCase().includes(this.searchTerm) ||
          notificacao.descricao?.toLowerCase().includes(this.searchTerm)
      );
    }

    if (this.selectedSetor) {
    }

    if (this.filtroLidas === 'lidas') {
      notificacoesFiltradas = notificacoesFiltradas.filter((n) => n.lida);
    } else if (this.filtroLidas === 'naoLidas') {
      notificacoesFiltradas = notificacoesFiltradas.filter((n) => !n.lida);
    }

    this.notificacoesFiltradas = notificacoesFiltradas;
    this.totalPaginas = Math.ceil(
      this.notificacoesFiltradas.length / this.itensPorPagina
    );
    this.atualizarPaginacao();
  }

  conectarNotificacoesTempoReal(): void {
    this.sseSubscription = this.notificacaoService
      .getNotificacoesTempoReal()
      .subscribe({
        next: (notificacao: Notificacao) => {
          console.log('Nova notificação recebida em tempo real:', notificacao);

          this.notificacoes.unshift(notificacao);

          this.aplicarFiltros();

          this.carregarContadorNaoLidas();

          this.showFeedback('info', notificacao.titulo, notificacao.descricao);
        },
        error: (error) => {
          console.error('Erro no stream de notificações:', error);
          setTimeout(() => {
            this.conectarNotificacoesTempoReal();
          }, 5000);
        },
      });
  }

  private showFeedback(
    type: 'success' | 'error' | 'info',
    message: string,
    description?: string
  ): void {
    if (this.feedbackComponent) {
      this.feedbackComponent.show(type, message, description);
    }
  }

  // Método para determinar se uma notificação está sendo processada
  isNotificacaoBeingProcessed(notificacao: Notificacao): boolean {
    return notificacao.id ? this.isMarkingAsRead[notificacao.id] : false;
  }

  formatarDescricaoComStatus(descricao: string): SafeHtml {
    if (!descricao) return '';

    let resultado = descricao;

    const padraoAtividade =
      /atividade\s+([^]+?)\s+de\s+(?:A_FAZER|EM_PROGRESSO|REVISAO|CONCLUIDO)/gi;

    resultado = resultado.replace(padraoAtividade, (match, nomeAtividade) => {
      const nomeFormatado = nomeAtividade.trim();
      const parteStatus = match.replace(`atividade ${nomeAtividade} `, '');
      return `atividade "${nomeFormatado}" ${parteStatus}`;
    });

    const substituicoes = [
      { regex: /\bA_FAZER\b/gi, classe: 'status-a-fazer', label: 'A fazer' },
      {
        regex: /\bEM_PROGRESSO\b/gi,
        classe: 'status-em-progresso',
        label: 'Em andamento',
      },
      { regex: /\bREVISAO\b/gi, classe: 'status-revisao', label: 'Revisão' },
      {
        regex: /\bCONCLUIDO\b/gi,
        classe: 'status-concluido',
        label: 'Concluído',
      },
    ];

    substituicoes.forEach(({ regex, classe, label }) => {
      resultado = resultado.replace(
        regex,
        `<span class="${classe}">${label}</span>`
      );
    });

    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}
