import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Noticia } from 'src/app/sistema/gerenciamento/forum-de-noticia/noticia';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  apiURL: string = environment.apiURLBase + '/api/noticias';

  constructor(private http: HttpClient) {}
}
