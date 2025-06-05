import { Component, OnInit, Input } from '@angular/core';
import { Setor } from '../../sistema/administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../sistema/administrativo/cadastro-de-colaborador/setor-descricao';

@Component({
  selector: 'app-setor-tag',
  templateUrl: './setor-tag.component.html',
  styleUrls: ['./setor-tag.component.css'],
})
export class SetorTagComponent {
  @Input() setor?: Setor | 'ALL';

  constructor() {}

  ngOnInit(): void {}

  get descricao(): string {
    if (this.setor === 'ALL') {
      return 'Todos os Setores';
    }
    return this.setor ? SetorDescricao[this.setor] : 'Desconhecido';
  }

  get cor(): string {
    if (this.setor === 'ALL') {
      return '#47484e';
    }
    switch (this.setor) {
      case Setor.CONTABIL:
        return '#08195D';
      case Setor.FISCAL:
        return '#1F337F';
      case Setor.PESSOAL:
        return '#4a59a0'; 
      case Setor.PARALEGAL:
        return '#585A60';
      case Setor.FINANCEIRO:
        return '#5a5f7b';
      default:
        return '#CCD0DE';
    }
  }

  get backgroundColor(): string {
    return this.lightenColor(this.cor, 0.5);
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  }
}
