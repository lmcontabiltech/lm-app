import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Prioridade } from 'src/app/sistema/gerenciamento/atividades/enums/prioridade';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';
import { StatusDescricao } from 'src/app/sistema/gerenciamento/atividades/enums/status-descricao';

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
}
