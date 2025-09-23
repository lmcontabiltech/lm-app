import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Prioridade } from 'src/app/sistema/gerenciamento/atividades/enums/prioridade';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';
import { StatusDescricao } from 'src/app/sistema/gerenciamento/atividades/enums/status-descricao';
import {
  MULTAS_TIPO,
  MultaTipo,
} from 'src/app/sistema/gerenciamento/atividades/enums/multa-tipo';
import { AtividadeService } from 'src/app/services/gerenciamento/atividade.service';

@Component({
  selector: 'app-modal-atividade',
  templateUrl: './modal-atividade.component.html',
  styleUrls: ['./modal-atividade.component.css'],
})
export class ModalAtividadeComponent {
  @Input() atividade: any;
  @Input() size: string = 'xl:max-w-7xl';
  @Input() membros: { nome: string; fotoUrl: string }[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() editarAtividade = new EventEmitter<string>();
  @Output() deletarAtividade = new EventEmitter<string>();
  @Output() atualizarSubtarefas = new EventEmitter<any[]>();

  loadingSubtarefas: { [key: number]: boolean } = {};

  constructor(private atividadeService: AtividadeService) {}

  onModalClose() {
    this.closeModal.emit();
  }

  getPriorityClass(): string {
    switch (this.atividade?.prioridade) {
      case Prioridade.ALTA:
        return 'priority-high';
      case Prioridade.MEDIA:
        return 'priority-medium';
      case Prioridade.BAIXA:
        return 'priority-low';
      default:
        return '';
    }
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

  EditarAtividade(id: string) {
    this.editarAtividade.emit(id);
  }

  DeletarAtividade(id: string) {
    this.deletarAtividade.emit(id);
  }

  getDescricaoStatus(status: string): string {
    return (
      StatusDescricao[status as keyof typeof StatusDescricao] ||
      status ||
      'Status desconhecido'
    );
  }

  getDescricaoMultas(multas: any[]): string {
    if (!multas || multas.length === 0) {
      return 'Nenhuma multa aplicada';
    }
    return multas
      .map((multa) => {
        const multaInfo = MULTAS_TIPO.find((m) => m.key === multa.tipo);
        const descricao = multaInfo ? multaInfo.descricao : multa.tipo;
        const valor =
          multa.valor !== undefined ? ` - R$ ${multa.valor.toFixed(2)}` : '';
        return `${descricao}${valor}`;
      })
      .join(', ');
  }

  getDescricaoMulta(tipo: string): string {
    const multaObj = MULTAS_TIPO.find((m) => m.key === tipo);
    return multaObj ? multaObj.descricao : tipo;
  }

  onSubtarefaToggle(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !this.atividade?.subtarefas || !this.atividade?.id) return;

    const subtarefa = this.atividade.subtarefas[index];
    const novoStatus = input.checked;
    const atividadeId = Number(this.atividade.id);
    const subtarefaId = Number(subtarefa.id);

    this.loadingSubtarefas[index] = true;

    this.atividadeService
      .atualizarStatusCheckedSubprocesso(atividadeId, subtarefaId, novoStatus)
      .subscribe({
        next: (response) => {
          console.log('Status da subtarefa atualizado com sucesso:', response);

          this.atividade.subtarefas[index].checked = novoStatus;

          this.atualizarSubtarefas.emit(this.atividade.subtarefas);

          this.loadingSubtarefas[index] = false;
        },
        error: (error) => {
          input.checked = !novoStatus;

          this.loadingSubtarefas[index] = false;
        },
      });
  }

  isSubtarefaLoading(index: number): boolean {
    return this.loadingSubtarefas[index] || false;
  }

  getChecklistPercent(subtarefas: any[]): number {
    if (!subtarefas?.length) return 0;
    const marcadas = subtarefas.filter((s) => s.checked).length;
    return Math.round((marcadas / subtarefas.length) * 100);
  }
}
