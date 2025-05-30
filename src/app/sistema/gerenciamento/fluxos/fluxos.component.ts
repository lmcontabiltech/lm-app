import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';
import { Processo } from '../processos/processo';

@Component({
  selector: 'app-fluxos',
  templateUrl: './fluxos.component.html',
  styleUrls: ['./fluxos.component.css'],
})
export class FluxosComponent implements OnInit {
  processos: Processo[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.processos.length / this.itensPorPagina);
  processosPaginados: Processo[] = [];
  selectedProcesso: any = null;

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
        console.log('Processos retornados pelo backend:', processos);
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

  visualizarFluxo(id: string): void {
    this.router.navigate(['/usuario/detalhes-fluxo', id]);
  }
}
