import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NoticiaService } from 'src/app/services/gerenciamento/noticia.service';
import { Noticia } from '../../forum-de-noticia/noticia';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/login/usuario';
import { Permissao } from 'src/app/login/permissao';

@Component({
  selector: 'app-detalhes-noticia',
  templateUrl: './detalhes-noticia.component.html',
  styleUrls: ['./detalhes-noticia.component.css'],
})
export class DetalhesNoticiaComponent implements OnInit {
  noticia!: Noticia;
  conteudoSanitizado: SafeHtml = '';
  usuario: Usuario | null = null;

  colaboradores: Array<{
    id: string;
    nome: string;
    username?: string;
    email?: string;
    fotoUrl: string;
    setor?: Setor;
  }> = [];

  paginaAtual = 1;
  itensPorPagina = 8;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarUsuario();
    this.carregarNoticia();
  }

  goBack() {
    this.location.back();
  }

  carregarNoticia(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.noticiaService.getNoticiaById(id).subscribe(
        (response) => {
          this.noticia = response;
          this.conteudoSanitizado = this.sanitizer.bypassSecurityTrustHtml(
            this.noticia.conteudo || '-'
          );
          const vistos = this.noticia.usuariosQueVisualizaram || [];
          this.colaboradores = vistos.map((u: any) => {
            let setorEnum: Setor | undefined;
            if (typeof u.setor === 'string') {
              const key = u.setor.toUpperCase().trim();
              setorEnum = (Setor as any)[key] as Setor | undefined;
            } else if (u.setor) {
              setorEnum = u.setor as Setor;
            }

            return {
              id: String(u.id),
              nome: u.nome,
              username: u.nome,
              email: u.email,
              fotoUrl: u.fotoUrl,
              setor: setorEnum,
            };
          });

          this.paginaAtual = 1;
          console.log('Dados da notícia carregados:', this.noticia);
        },
        (error) => {
          console.error('Erro ao carregar os dados da notícia:', error);
        }
      );
    }
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRandomColor(seed: string): string {
    const colors = [
      '#FFB3BA', // Rosa pastel
      '#FFDFBA', // Laranja pastel
      '#BAFFC9', // Verde pastel
      '#BAE1FF', // Azul pastel
      '#D5BAFF', // Roxo pastel
    ];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  get totalItens() {
    return this.colaboradores.length;
  }

  get colaboradoresPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.colaboradores.slice(inicio, fim);
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
  }

  private carregarUsuario(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario) => (this.usuario = usuario),
      error: (err) =>
        console.warn('Não foi possível carregar perfil do usuário', err),
    });
  }

  get isAdmin(): boolean {
    const p = this.usuario?.permissao;
    if (!p) return false;
    const norm = String(p).toUpperCase().trim();
    return norm === 'ADMIN' || norm === Permissao.ADMIN;
  }
}
