import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
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

  cadastrarNoticia(formData: FormData): Observable<any> {
    console.log('Dados enviados para o backend:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http.post<any>(this.apiURL, formData).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro bruto recebido do servidor:', error);

        let errorMessage = 'Erro ao salvar a notícia.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            const firstErrorKey = Object.keys(error.error.errors)[0];
            errorMessage = error.error.errors[firstErrorKey];
          }
        }

        console.error('Mensagem de erro processada:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  editarNoticia(id: number, formData: FormData): Observable<any> {
    console.log('Dados enviados para edição da notícia:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    const url = `${this.apiURL}/${id}`;

    return this.http.put<any>(url, formData).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro bruto recebido do servidor:', error);

        let errorMessage = 'Erro ao editar o produto.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            const firstErrorKey = Object.keys(error.error.errors)[0];
            errorMessage = error.error.errors[firstErrorKey];
          }
        }

        console.error('Mensagem de erro processada:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiURL).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar as notícias.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getNoticiasGeral(): Observable<Noticia[]> {
    const url = `${environment.apiURLBase}/api/noticias/geral`;
    return this.http.get<Noticia[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar todas as notícias.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getNoticiaById(id: number): Observable<Noticia> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Noticia>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar a notícia.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteNoticiaById(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao deletar a notícia.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  marcarNoticiaComoVisualizada(id: number): Observable<any> {
    const url = `${this.apiURL}/${id}/visualizar`;
    return this.http.patch<any>(url, null).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro ao marcar notícia como visualizada.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getNoticiasLidaOuNaoLida(lida: string): Observable<Noticia[]> {
    const url = `${this.apiURL}/lida-e-nao-lida`;
    const params = { lida };
    return this.http.get<Noticia[]>(url, { params }).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar notícias.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  buscarNoticiasPorTitulo(titulo: string): Observable<Noticia[]> {
    const url = `${this.apiURL}/busca`;
    const params = { titulo };
    return this.http.get<Noticia[]>(url, { params }).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar notícias pelo título.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getNoticiasPorSetor(setor: string): Observable<Noticia[]> {
    const url = `${this.apiURL}/setor`;
    const params = { setor };
    return this.http.get<Noticia[]>(url, { params }).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar notícias pelo setor.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteImagemNoticia(id: number): Observable<void> {
    const url = `${this.apiURL}/${id}/imagem`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro ao excluir a imagem da notícia.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
