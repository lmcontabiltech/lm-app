import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Atividade } from './atividades';
import { Prioridade } from './enums/prioridade';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { AtividadeService } from 'src/app/services/gerenciamento/atividade.service';
import { ModalAtividadeService } from 'src/app/services/modal/modalAtividade.service';
import { ModalDeleteService } from 'src/app/services/modal/modalDeletar.service';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';
import { AutoCompleteOption } from 'src/app/shared/select-auto-complete/select-auto-complete.component';
import { FeedbackComponent } from 'src/app/shared/feedback/feedback.component';
import { ErrorMessageService } from 'src/app/services/feedback/error-message.service';

interface Tasks {
  [key: string]: Atividade[];
}

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css'],
})
export class AtividadesComponent implements OnInit, AfterViewInit {
  @ViewChild(FeedbackComponent) feedbackComponent!: FeedbackComponent;

  statuses: string[] = ['backlog', 'emProgresso', 'revisao', 'concluido'];
  statusLabels: { [key: string]: string } = {
    backlog: 'A fazer',
    emProgresso: 'Em andamento',
    revisao: 'Revisão',
    concluido: 'Concluído',
  };

  atividades: Tasks = {
    backlog: [],
    emProgresso: [],
    revisao: [],
    concluido: [],
  };

  dropListIds: string[] = [];

  statusColors: { [key: string]: string } = {
    backlog: '#a22bc6',
    emProgresso: '#3498db',
    revisao: '#f39c12',
    concluido: '#1D7206',
  };

  filtroAberto = false;

  empresasOptions: AutoCompleteOption[] = [];
  empresasSelecionadas: string[] = [];

  isLoading = false;

  constructor(
    private router: Router,
    private atividadeService: AtividadeService,
    private modalAtividadeService: ModalAtividadeService,
    private modalDeleteService: ModalDeleteService,
    private empresasService: EmpresasService,
    private errorMessageService: ErrorMessageService
  ) {}

  ngOnInit(): void {
    this.dropListIds = this.statuses.map((status) => status);
    this.carregarAtividades();
    this.carregarEmpresas();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.exibirMensagemDeSucesso();
    }, 0);
  }

  drop(event: CdkDragDrop<Atividade[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const atividadeMovida = event.previousContainer.data[event.previousIndex];
      const novoStatus = event.container.id;
      const statusBackend = this.mapColunaToStatus(novoStatus);

      // Move o card imediatamente
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      atividadeMovida.status = statusBackend;

      this.atividadeService
        .atualizarStatusAtividade(atividadeMovida.id as string, statusBackend)
        .subscribe(
          (res) => {
            console.log('Status atualizado no backend:', res);
          },
          (error) => {
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              event.currentIndex,
              event.previousIndex
            );
            atividadeMovida.status = this.mapColunaToStatus(
              event.previousContainer.id
            );
            console.error('Erro ao atualizar status:', error);
          }
        );
    }
  }

  onDragMoved(event: any, dropList: HTMLElement) {
    if (window.innerWidth <= 900) {
      const container = dropList.parentElement?.parentElement?.parentElement;
      if (!container) return;

      const pointerX = event.pointerPosition.x;
      const containerRect = container.getBoundingClientRect();

      const scrollMargin = 60;
      const scrollSpeed = 20;

      if (pointerX > containerRect.right - scrollMargin) {
        container.scrollLeft += scrollSpeed;
      } else if (pointerX < containerRect.left + scrollMargin) {
        container.scrollLeft -= scrollSpeed;
      }
    }
  }

  cadastrarAtividade(): void {
    this.router.navigate(['/usuario/cadastro-de-atividade']);
  }

  carregarAtividades(): void {
    this.atividadeService.getAtividades().subscribe(
      (atividades: Atividade[]) => {
        console.log('Lista de atividades retornada pelo backend:', atividades);
        this.statuses.forEach((status) => (this.atividades[status] = []));
        atividades.forEach((atividade) => {
          const statusColuna = this.mapStatusToColuna(
            atividade.status ?? 'A_FAZER'
          );
          if (this.atividades[statusColuna]) {
            this.atividades[statusColuna].push(atividade);
          } else {
            this.atividades['backlog'].push(atividade);
          }
        });
      },
      (error) => {
        console.error('Erro ao carregar atividades:', error);
      }
    );
  }

  private statusToColunaMap: { [key: string]: string } = {
    A_FAZER: 'backlog',
    EM_PROGRESSO: 'emProgresso',
    REVISAO: 'revisao',
    CONCLUIDO: 'concluido',
  };

  private colunaToStatusMap: { [key: string]: string } = {
    backlog: 'A_FAZER',
    emProgresso: 'EM_PROGRESSO',
    revisao: 'REVISAO',
    concluido: 'CONCLUIDO',
  };

  private mapStatusToColuna(status: string): string {
    return this.statusToColunaMap[status] || 'backlog';
  }

  private mapColunaToStatus(coluna: string): string {
    return this.colunaToStatusMap[coluna] || 'A_FAZER';
  }

  abrirModalAtividade(id: string | undefined): void {
    if (!id) return;
    this.atividadeService.getAtividadeById(id).subscribe((atividade) => {
      this.modalAtividadeService.openModal(
        {
          atividade,
          size: 'lg',
        },
        (atividadeId: string) => {
          this.editarAtividade(atividadeId);
        },
        () => {
          this.abrirModalConfirmacaoDeletar(atividade);
        }
      );
    });
  }

  editarAtividade(id: string) {
    this.modalAtividadeService.closeModal();
    this.router.navigate(['/usuario/cadastro-de-atividade', id]);
  }

  deletarAtividade(id: string) {
    this.atividadeService.deletarAtividade(id).subscribe({
      next: () => {
        this.modalAtividadeService.closeModal();
        this.carregarAtividades();
        this.showFeedback('success', 'Atividade arquivada com sucesso!');
      },
      error: (err) => {
        const status = err.status || 500;
        const msg = err.error?.message
          ? `Atividade: ${err.error.message}`
          : this.errorMessageService.getErrorMessage(
              status,
              'DELETE',
              'atividade'
            );
        this.showFeedback('error', msg);
      },
    });
  }

  abrirModalConfirmacaoDeletar(atividade: Atividade): void {
    this.modalDeleteService.openModal(
      {
        title: 'Arquivar Atividade',
        description: `Tem certeza que deseja arquivar a atividade <strong>${atividade.nome}</strong>?`,
        item: atividade,
        deletarTextoBotao: 'Arquivar',
        size: 'md',
      },
      () => {
        this.deletarAtividade(atividade.id!);
      }
    );
  }

  aplicarFiltro(filtro: any) {
    console.log('Filtro recebido em aplicarFiltro:', filtro);
    const filtroRequest: any = {};

    if (filtro.atribuidoAMim) filtroRequest.atribuidas_a_mim = true;
    if (filtro.semMembros) filtroRequest.sem_membros = true;
    if (filtro.marcado) filtroRequest.concluido = true;
    if (filtro.naoMarcado) filtroRequest.concluido = false;

    if (Array.isArray(filtro.setores) && filtro.setores.length > 0) {
      filtroRequest.setores = filtro.setores;
    }

    if (filtro.periodo) {
      const dias = Number(filtro.periodo);
      const data = new Date();
      data.setHours(0, 0, 0, 0);
      data.setDate(data.getDate() - dias);
      filtroRequest.startDate = data.toISOString().split('T')[0];
    }

    const semFiltros =
      !filtro.atribuidoAMim &&
      !filtro.semMembros &&
      !filtro.marcado &&
      !filtro.naoMarcado &&
      (!Array.isArray(filtro.setores) ||
        filtro.setores.length === 0 ||
        filtro.todosSetores) &&
      (!filtro.periodo || filtro.periodo === '');

    if (semFiltros) {
      console.log('Nenhum filtro ativo, buscando todas as atividades...');
      this.carregarAtividades();
      return;
    }

    console.log('Filtro enviado ao backend:', filtroRequest);
    this.atividadeService.getAtividadesPorFiltro(filtroRequest).subscribe(
      (atividades: Atividade[]) => {
        console.log('Retorno do backend:', atividades);
        this.statuses.forEach((status) => (this.atividades[status] = []));
        atividades.forEach((atividade) => {
          const statusColuna = this.mapStatusToColuna(
            atividade.status ?? 'A_FAZER'
          );
          if (this.atividades[statusColuna]) {
            this.atividades[statusColuna].push(atividade);
          } else {
            this.atividades['A_FAZER'].push(atividade);
          }
        });
      },
      (error) => {
        console.error('Erro ao aplicar filtro:', error);
      }
    );
  }

  carregarEmpresas(): void {
    this.empresasService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresasOptions = empresas.map((empresa) => ({
          value: empresa.id.toString(),
          description: empresa.razaoSocial,
        }));
        console.log('Empresas carregadas para o select:', this.empresasOptions);
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
      },
    });
  }

  onEmpresaSelecionada(empresas: string[]): void {
    this.empresasSelecionadas = empresas;
    console.log('Empresas selecionadas:', empresas);

    if (empresas && empresas.length > 0) {
      const idsEmpresas = empresas.map((id) => Number(id));
      this.filtrarAtividadesPorEmpresas(idsEmpresas);
    } else {
      this.carregarAtividades();
    }
  }

  private filtrarAtividadesPorEmpresas(idsEmpresas: number[]): void {
    console.log('Filtrando atividades por empresas:', idsEmpresas);

    this.atividadeService.getAtividadesPorEmpresas(idsEmpresas).subscribe({
      next: (response) => {
        console.log('Atividades filtradas por empresas:', response);

        // CORREÇÃO: Extrair o array de atividades do objeto response
        const atividades = response.atividades || response;

        this.statuses.forEach((status) => (this.atividades[status] = []));
        atividades.forEach((atividade: any) => {
          const statusColuna = this.mapStatusToColuna(
            atividade.status ?? 'A_FAZER'
          );
          if (this.atividades[statusColuna]) {
            this.atividades[statusColuna].push(atividade);
          } else {
            this.atividades['backlog'].push(atividade);
          }
        });
      },
      error: (error) => {
        console.error('Erro ao filtrar atividades por empresas:', error);
      },
    });
  }

  private exibirMensagemDeSucesso(): void {
    const state = window.history.state as {
      successMessage?: string;
      errorMessage?: string;
    };

    if (state?.successMessage) {
      this.showFeedback('success', state.successMessage);
      window.history.replaceState({}, document.title);
    }

    if (state?.errorMessage) {
      this.showFeedback('error', state.errorMessage);
      window.history.replaceState({}, document.title);
    }
  }

  private showFeedback(type: 'success' | 'error', message: string): void {
    const title = type === 'success' ? 'Sucesso' : 'Erro';
    this.feedbackComponent?.show(type, title, message);
  }
}
