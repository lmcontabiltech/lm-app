import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { HistoricoAtividade } from './historico';

@Component({
  selector: 'app-historico-atividades',
  templateUrl: './historico-atividades.component.html',
  styleUrls: ['./historico-atividades.component.css'],
})
export class HistoricoAtividadesComponent implements OnInit {
  historico: HistoricoAtividade[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.historico.length / this.itensPorPagina);
  historicoPaginado: HistoricoAtividade[] = [];
  selectedProcesso: any = null;
  isLoading = false;
  termoBusca: string = '';
  mensagemBusca: string = '';

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  selectedSetor: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.historicoPaginado = this.historico.slice(inicio, fim);
  }

  get totalItens() {
    return this.historico.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  visualizarAtividade(id: string): void {
    this.router.navigate(['/usuario/detalhes-atividade', id]);
  }

  onSetorChange() {}
}
