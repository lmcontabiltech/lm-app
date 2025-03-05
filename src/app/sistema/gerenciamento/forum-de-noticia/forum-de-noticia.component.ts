import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum-de-noticia',
  templateUrl: './forum-de-noticia.component.html',
  styleUrls: ['./forum-de-noticia.component.css'],
})
export class ForumDeNoticiaComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  cadastrarNoticia(): void {
    this.router.navigate(['/usuario/cadastro-de-noticia']);
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }
}
