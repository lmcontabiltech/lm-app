import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Noticia } from './noticia';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { NoticiaService } from 'src/app/services/gerenciamento/noticia.service';
import { TipoNoticia, TipoNoticiaCor } from './enums/tipo-noticia';
import { TipoNoticiaDescricao } from './enums/tipo-noticia-descricao';

@Component({
  selector: 'app-forum-de-noticia',
  templateUrl: './forum-de-noticia.component.html',
  styleUrls: ['./forum-de-noticia.component.css'],
})
export class ForumDeNoticiaComponent implements OnInit {
  noticias: Noticia[] = [];

  itensPorPagina = 8;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.noticias.length / this.itensPorPagina);
  noticiasPaginados: Noticia[] = [];

  termoBusca: string = '';
  mensagemBusca: string = '';
  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  lidas = [
    { value: 'false', description: 'Não lidas' },
    { value: 'true', description: 'Lidas' },
  ];
  selectedLida: string = '';

  constructor(private router: Router, private noticiaService: NoticiaService) {}

  ngOnInit(): void {
    this.exibirMensagemDeSucesso();
    this.atualizarPaginacao();
    this.fetchNoticias();
  }

  centralNoticia(): void {
    this.router.navigate(['/usuario/central-de-noticias']);
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

    this.noticiaService.getNoticias().subscribe(
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

  visualizarNoticia(id: string | number): void {
    const idNum = typeof id === 'string' ? Number(id) : id;
    this.noticiaService.marcarNoticiaComoVisualizada(idNum).subscribe({
      next: () => {
        const noticia = this.noticiasPaginados.find(
          (n) => String(n.id) === String(id)
        );
        if (noticia) noticia.lida = true;
        // Navegue para detalhes se necessário
        this.router.navigate(['/usuario/detalhes-noticia', idNum]);
      },
      error: (err) => {
        console.error('Erro ao marcar como visualizada:', err);
      },
    });
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

  stripHtmlTags(html: string): string {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getTipoDescricao(tipo: string | TipoNoticia): string {
    const tipoFinal = tipo && tipo !== '' ? tipo : TipoNoticia.COMUNICADO;
    return (
      TipoNoticiaDescricao[tipoFinal as TipoNoticia] ||
      TipoNoticiaDescricao[TipoNoticia.COMUNICADO]
    );
  }

  getTipoCor(tipo: string | TipoNoticia): string {
    const tipoFinal = tipo && tipo !== '' ? tipo : TipoNoticia.COMUNICADO;
    return (
      TipoNoticiaCor[tipoFinal as TipoNoticia] ||
      TipoNoticiaCor[TipoNoticia.COMUNICADO]
    );
  }

  onNoticiaChange() {
    this.isLoading = true;
    console.log('Filtro selecionado:', this.selectedLida);
    if (this.selectedLida === '') {
      this.fetchNoticias();
    } else {
      this.noticiaService.getNoticiasLidaOuNaoLida(this.selectedLida).subscribe(
        (noticias) => {
          console.log('Notícias filtradas:', noticias);
          this.noticias = noticias;
          this.totalPaginas = Math.ceil(
            this.noticias.length / this.itensPorPagina
          );
          this.atualizarPaginacao();
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.mensagemBusca = 'Erro ao buscar notícias.';
        }
      );
    }
  }
}
