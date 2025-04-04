import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Processo } from './processo';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

@Component({
  selector: 'app-processos',
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.css']
})
export class ProcessosComponent implements OnInit {
  processos: Processo[] = [
        { nome: 'Título da notícia', tipo: 'Fixo', data: '22/12/2024 às 12:30', setor: Setor.FISCAL },
        { nome: 'Título da notícia', tipo: 'Variável', data: '22/12/2024 às 12:30', setor: Setor.PESSOAL },
        { nome: 'Título da notícia', tipo: 'Fixo', data: '22/12/2024 às 12:30', setor: Setor.CONTABIL },
        { nome: 'Título da notícia', tipo: 'Fixo', data: '22/12/2024 às 12:30', setor: Setor.FISCAL },
        { nome: 'Título da notícia', tipo: 'Variável', data: '22/12/2024 às 12:30', setor: Setor.CONTABIL },
        { nome: 'Título da notícia', tipo: 'Variável', data: '22/12/2024 às 12:30', setor: Setor.CONTABIL },
        { nome: 'Título da notícia', tipo: 'Fixo', data: '22/12/2024 às 12:30', setor: Setor.PESSOAL },
        { nome: 'Título da notícia', tipo: 'Fixo', data: '22/12/2024 às 12:30', setor: Setor.FISCAL }
      ];
  
      itensPorPagina = 5;
      paginaAtual = 1;
      totalPaginas = Math.ceil(this.processos.length / this.itensPorPagina);
      processosPaginados: Processo[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.atualizarPaginacao();
  }

  cadastrarProcesso(): void {
    this.router.navigate(['/usuario/cadastro-de-processo']);
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.processosPaginados = this.processos.slice(inicio, fim);
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
