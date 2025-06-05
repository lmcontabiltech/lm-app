import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() paginaAtual: number = 1;
  @Input() totalItens: number = 0;
  @Input() itensPorPagina: number = 6;
  @Output() paginaMudou = new EventEmitter<number>();

  totalPaginas: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.calcularTotalPaginas();
  }

  ngOnChanges(): void {
    this.calcularTotalPaginas();
  }

  calcularTotalPaginas() {
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.paginaMudou.emit(this.paginaAtual);
    }
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.paginaMudou.emit(this.paginaAtual);
    }
  }

  mudarPagina(pagina: number | string) {
    if (typeof pagina === 'number' && pagina !== this.paginaAtual) {
      this.paginaAtual = pagina;
      this.paginaMudou.emit(this.paginaAtual);
    }
  }

  get paginasParaExibir(): (number | string)[] {
    const paginas: (number | string)[] = [];
    const total = this.totalPaginas;
    const atual = this.paginaAtual;

    if (total <= 6) {
      for (let i = 1; i <= total; i++) {
        paginas.push(i);
      }
      return paginas;
    }
    paginas.push(1, 2);

    if (atual <= 4) {
      paginas.push(3, 4, 5);
      paginas.push('...');
    } else if (atual >= total - 3) {
      paginas.push('...');
      paginas.push(total - 3, total - 2, total - 1, total);
    } else {
      paginas.push('...');
      paginas.push(atual - 1, atual, atual + 1);
      paginas.push('...');
    }
    return paginas.filter((v, i, a) => v !== '...' || a[i - 1] !== '...');
  }
}
