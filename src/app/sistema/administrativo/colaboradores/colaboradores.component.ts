import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Colaborador } from './colaborador';
import { Setor } from '../cadastro-de-colaborador/setor';
import { ColaboradoresService } from '../../../services/colaboradores.service';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css'],
})
export class ColaboradoresComponent implements OnInit {
  colaboradores: Colaborador[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.colaboradores.length / this.itensPorPagina);
  colaboradoresPaginados: Colaborador[] = [];

  constructor(
    private router: Router,
    private colaboradoresService: ColaboradoresService
  ) {}

  ngOnInit(): void {
    this.fetchColaboradores();
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

  fetchColaboradores(): void {
    this.colaboradoresService.getUsuarios().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response;
        this.totalPaginas = Math.ceil(this.colaboradores.length / this.itensPorPagina);
        this.atualizarPaginacao();
      },
      (error) => {
        console.error('Erro ao buscar colaboradores:', error);
      }
    );
  }
}
