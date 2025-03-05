import { Component, OnInit, Input } from '@angular/core';
import { Setor } from '../../sistema/administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../sistema/administrativo/cadastro-de-colaborador/setor-descricao';

@Component({
  selector: 'app-setor-tag',
  templateUrl: './setor-tag.component.html',
  styleUrls: ['./setor-tag.component.css'],
})
export class SetorTagComponent {
  @Input() setor?: Setor;

  constructor() {}

  ngOnInit(): void {}

  get descricao(): string {
    return this.setor ? SetorDescricao[this.setor] : '';
  }

  get cor(): string {
    switch (this.setor) {
      case Setor.CONTABIL:
        return '#FF5733';
      case Setor.FISCAL:
        return '#1e6c20';
      case Setor.PESSOAL:
        return '#3357FF'; 
      case Setor.PARALEGAL:
        return '#FF33A1';
      case Setor.FINANCEIRO:
        return '#d99400';
      default:
        return '#ffffff';
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
