import { Component, OnInit } from '@angular/core';
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
import { ModalService } from 'src/app/services/modal/modalDeletar.service';

interface Tasks {
  [key: string]: Atividade[];
}

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css'],
})
export class AtividadesComponent implements OnInit {
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

  constructor(
    private router: Router,
    private atividadeService: AtividadeService,
    private modalAtividadeService: ModalAtividadeService,
    private modalDeleteService: ModalService
  ) {}

  ngOnInit(): void {
    this.dropListIds = this.statuses.map((status) => status);
    this.carregarAtividades();
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
      },
      error: (err) => {
        alert(err.message || 'Erro ao deletar atividade.');
      },
    });
  }

  abrirModalConfirmacaoDeletar(atividade: Atividade): void {
    this.modalDeleteService.openModal(
      {
        title: 'Remover Atividade',
        description: `Tem certeza que deseja excluir a atividade <strong>${atividade.nome}</strong>?`,
        item: atividade,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deletarAtividade(atividade.id!);
      }
    );
  }

  aplicarFiltro(filtro: any) {
    // Lógica para aplicar o filtro nas atividades
  }
}
