import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Colaborador } from './colaborador';
import { Setor } from '../cadastro-de-colaborador/setor';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css'],
})
export class ColaboradoresComponent implements OnInit {
  colaboradores: Colaborador[] = [
      { nome: 'Carla Américo', setor: Setor.PESSOAL, email: 'exemplo@exemplo.com' },
      { nome: 'Darrell Steward', setor: Setor.FISCAL, email: 'exemplo@exemplo.com' },
      { nome: 'Darlene Robertson', setor: Setor.CONTABIL, email: 'exemplo@exemplo.com' },
      { nome: 'Kristin Watson', setor: Setor.PARALEGAL, email: 'exemplo@exemplo.com' },
      { nome: 'Jacob Jones', setor: Setor.FINANCEIRO, email: 'exemplo@exemplo.com' },
      { nome: 'Ralph Edwards', setor: Setor.PESSOAL, email: 'exemplo@exemplo.com' },
      { nome: 'Annette Black', setor: Setor.FISCAL, email: 'exemplo@exemplo.com' },
      { nome: 'Carla Américo', setor: Setor.PESSOAL, email: 'exemplo@exemplo.com' }
    ];
  
    itensPorPagina = 5;
    paginaAtual = 1;
    totalPaginas = Math.ceil(this.colaboradores.length / this.itensPorPagina);
    colaboradoresPaginados: Colaborador[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.atualizarPaginacao();
  }

  cadastrarColaborador(): void {
    this.router.navigate(['/usuario/cadastro-de-colaborador']);
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.colaboradoresPaginados = this.colaboradores.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }
}
