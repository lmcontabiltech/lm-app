import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NoticiaService } from 'src/app/services/gerenciamento/noticia.service';
import { Noticia } from '../../forum-de-noticia/noticia';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-detalhes-noticia',
  templateUrl: './detalhes-noticia.component.html',
  styleUrls: ['./detalhes-noticia.component.css'],
})
export class DetalhesNoticiaComponent implements OnInit {
  noticia!: Noticia;
  conteudoSanitizado: SafeHtml = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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
}
