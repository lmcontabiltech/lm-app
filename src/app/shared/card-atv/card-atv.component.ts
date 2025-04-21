import { Component, OnInit, Input } from '@angular/core';
import { Atividade } from 'src/app/sistema/gerenciamento/atividades/atividades';
import { Prioridade } from 'src/app/sistema/gerenciamento/atividades/enums/prioridade';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';

@Component({
  selector: 'app-card-atv',
  templateUrl: './card-atv.component.html',
  styleUrls: ['./card-atv.component.css'],
})
export class CardAtvComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() date!: string;
  @Input() priority!: Prioridade;
  @Input() sector!: Setor;

  constructor() {}

  ngOnInit(): void {}

  getPriorityClass(): string {
    switch (this.priority) {
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
}
