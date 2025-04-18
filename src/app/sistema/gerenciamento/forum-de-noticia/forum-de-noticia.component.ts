import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Noticia } from './noticia';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

@Component({
  selector: 'app-forum-de-noticia',
  templateUrl: './forum-de-noticia.component.html',
  styleUrls: ['./forum-de-noticia.component.css'],
})
export class ForumDeNoticiaComponent implements OnInit {
  noticias: Noticia[] = [
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: Setor.FISCAL },
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: Setor.PESSOAL },
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: Setor.CONTABIL },
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: Setor.FISCAL },
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: 'ALL' },
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: Setor.CONTABIL },
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: Setor.PESSOAL },
      { titulo: 'Título da notícia', data: '22/12/2024 às 12:30', setor: Setor.FISCAL }
    ];

    itensPorPagina = 5;
    paginaAtual = 1;
    totalPaginas = Math.ceil(this.noticias.length / this.itensPorPagina);
    noticiasPaginados: Noticia[] = [];

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.atualizarPaginacao();
  }

  cadastrarNoticia(): void {
    this.router.navigate(['/usuario/cadastro-de-noticia']);
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.noticiasPaginados = this.noticias.slice(inicio, fim);
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
