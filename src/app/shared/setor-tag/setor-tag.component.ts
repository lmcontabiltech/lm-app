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
      case Setor.JURIDICO:
        return '#2C3E50';
      case Setor.ADMINISTRATIVO:
        return '#34495E';
      case Setor.RH:
        return '#6A3BCE';
      case Setor.SUPORTE_TI:
        return '#0984E3';
      case Setor.ESTAGIARIO:
        return '#3A3AB3';
      case Setor.OUTRO:
        return '#217f94ff';
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

    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;

    R = Math.max(0, Math.min(255, R));
    G = Math.max(0, Math.min(255, G));
    B = Math.max(0, Math.min(255, B));

    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }
}
