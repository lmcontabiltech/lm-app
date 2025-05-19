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

  @Input() membros: { nome: string; fotoUrl: string }[] = [];

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
}
