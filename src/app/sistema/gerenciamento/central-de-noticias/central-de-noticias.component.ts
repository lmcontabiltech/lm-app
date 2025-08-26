import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Noticia } from '../forum-de-noticia/noticia';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { NoticiaService } from 'src/app/services/gerenciamento/noticia.service';
import { ModalDeleteService } from 'src/app/services/modal/modalDeletar.service';

@Component({
  selector: 'app-central-de-noticias',
  templateUrl: './central-de-noticias.component.html',
  styleUrls: ['./central-de-noticias.component.css'],
})
export class CentralDeNoticiasComponent implements OnInit {
  noticias: Noticia[] = [];

  itensPorPagina = 6;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.noticias.length / this.itensPorPagina);
  noticiasPaginados: Noticia[] = [];

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;
  selectedNoticia: any = null;

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  selectedSetor: string = '';

  constructor(
    private router: Router,
    private noticiaService: NoticiaService,
    private location: Location,
    private modaldeleteService: ModalDeleteService
  ) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.atualizarPaginacao();
    this.fetchNoticias();
  }

  goBack() {
    this.router.navigate(['/usuario/forum-de-noticias']);
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

  get totalItens() {
    return this.noticias.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  fetchNoticias(): void {
    this.isLoading = true;

    this.noticiaService.getNoticiasGeral().subscribe(
      (noticias: any[]) => {
        console.log('Notícias retornadas:', noticias);
        this.noticias = noticias;
        this.totalPaginas = Math.ceil(
          this.noticias.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar noticias:', error);
        this.isLoading = false;
      }
    );
  }

  visualizarNoticia(id: string): void {
    console.log('Visualizando notícia com ID:', id);
    this.router.navigate(['/usuario/detalhes-noticia', id]);
    console.log('Navegando para detalhes da notícia com ID:', id);
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

  editarNoticia(id: string): void {
    this.router.navigate(['/usuario/cadastro-de-noticia', id]);
  }

  deletarNoticia(id: string): void {
    const noticiaRemovida = this.noticias.find((n) => n.id === id);
    this.noticiaService.deleteNoticiaById(id).subscribe(
      () => {
        this.noticias = this.noticias.filter((n) => n.id !== id);
        this.totalPaginas = Math.ceil(
          this.noticias.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.showMessage(
          'success',
          `Notícia "${noticiaRemovida?.titulo || ''}" deletada com sucesso!`
        );
      },
      (error: any) => {
        console.error('Erro ao excluir notícia:', error);
      }
    );
  }

  openModalDeletar(noticia: any): void {
    this.selectedNoticia = noticia;

    this.modaldeleteService.openModal(
      {
        title: 'Remoção de Notícia',
        description: `Tem certeza que deseja excluir a notícia <strong>${noticia.titulo}</strong> cadastrada?`,
        item: noticia,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deletarNoticia(noticia.id);
      }
    );
  }

  onSetorChange() {
    if (!this.selectedSetor) {
      this.fetchNoticias();
      return;
    }
    console.log('Setor selecionado:', this.selectedSetor);
    this.isLoading = true;
    this.noticiaService.getNoticiasPorSetor(this.selectedSetor).subscribe(
      (noticias) => {
        console.log('Notícias retornadas pelo backend:', noticias);
        this.noticias = noticias;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(
          this.noticias.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
        this.isLoading = false;
        this.mensagemBusca =
          noticias.length === 0
            ? 'Nenhuma notícia encontrada para o setor selecionado.'
            : '';
      },
      (error) => {
        this.isLoading = false;
        this.mensagemBusca = 'Erro ao buscar notícias por setor.';
        console.error(error);
      }
    );
  }
}
