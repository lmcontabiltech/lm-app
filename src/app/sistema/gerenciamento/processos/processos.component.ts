import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Processo } from './processo';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';

@Component({
  selector: 'app-processos',
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.css'],
})
export class ProcessosComponent implements OnInit {
  processos: Processo[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.processos.length / this.itensPorPagina);
  processosPaginados: Processo[] = [];

  constructor(
    private router: Router,
    private processoService: ProcessoService
  ) {}

  ngOnInit(): void {
    this.fetchProcessos();
    this.atualizarPaginacao();
  }

  cadastrarProcesso(): void {
    this.router.navigate(['/usuario/cadastro-de-processos']);
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  fetchProcessos(): void {
    this.processoService.getProcessos().subscribe(
      (processos: Processo[]) => {
        this.processos = processos;
        this.totalPaginas = Math.ceil(
          this.processos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
      },
      (error) => {
        console.error('Erro ao carregar processos:', error);
      }
    );
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
