import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Processo } from './processo';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';
import { ModalService } from 'src/app/services/modal/modalDeletar.service';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';

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
  selectedProcesso: any = null;
  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  selectedSetor: string = '';

  constructor(
    private router: Router,
    private processoService: ProcessoService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
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

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  editarProcesso(id: string): void {
    this.router.navigate(['/usuario/cadastro-de-processos', id]);
  }

  deletarProcesso(id: string): void {
    const processoRemovido = this.processos.find((p) => p.id === id);
    this.processoService.deletarProcesso(id).subscribe(
      () => {
        this.processos = this.processos.filter(
          (processo) => processo.id !== id
        );
        this.totalPaginas = Math.ceil(
          this.processos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.showMessage(
          'success',
          `Processo "${processoRemovido?.nome || ''}" deletado com sucesso!`
        );
      },
      (error: any) => {
        console.error('Erro ao excluir processo:', error);
      }
    );
  }

  openModalDeletar(processo: any): void {
    this.selectedProcesso = processo;

    this.modalService.openModal(
      {
        title: 'Remoção de Processo',
        description: `Tem certeza que deseja excluir o processo <strong>${processo.nome}</strong> cadastrado?`,
        item: processo,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deletarProcesso(processo.id);
      }
    );
  }

  exibirMensagemDeSucesso(): void {
    const state = window.history.state as { successMessage?: string };
    if (state?.successMessage) {
      this.successMessage = state.successMessage;
      setTimeout(() => (this.successMessage = ''), 3000);
      window.history.replaceState({}, document.title);
    }
  }

  showMessage(type: 'success' | 'error', msg: string) {
    this.clearMessage();
    if (type === 'success') this.successMessage = msg;
    this.messageTimeout = setTimeout(() => this.clearMessage(), 3000);
  }

  clearMessage() {
    this.successMessage = '';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
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
