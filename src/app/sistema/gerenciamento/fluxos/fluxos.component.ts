import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';
import { Processo } from '../processos/processo';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';

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
  isLoading = false;
  termoBusca: string = '';
  mensagemBusca: string = '';

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  selectedSetor: string = '';

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
    this.isLoading = true;
    this.processoService.getProcessos().subscribe(
      (processos: Processo[]) => {
        console.log('Processos retornados pelo backend:', processos);
        this.processos = processos;
        this.totalPaginas = Math.ceil(
          this.processos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar processos:', error);
        this.isLoading = false;
      }
    );
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.processosPaginados = this.processos.slice(inicio, fim);
  }

  get totalItens() {
    return this.processos.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  visualizarFluxo(id: string): void {
    this.router.navigate(['/usuario/detalhes-fluxo', id]);
  }

  onSetorChange() {
    const setores = this.selectedSetor ? [this.selectedSetor] : [];
    this.isLoading = true;
    this.processoService.getProcessosBySetores(setores).subscribe(
      (processos) => {
        this.processos = processos;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.processos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        this.mensagemBusca =
          processos.length === 0
            ? 'Nenhum processo encontrado para o setor selecionado.'
            : '';
      },
      (error) => {
        this.isLoading = false;
        this.mensagemBusca = 'Erro ao buscar processos por setor.';
        console.error(error);
      }
    );
  }
}
