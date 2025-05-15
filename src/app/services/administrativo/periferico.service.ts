import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Periferico } from 'src/app/sistema/administrativo/perifericos/periferico';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PerifericoService {
  apiURL: string = environment.apiURLBase + '/api/periferico';

  constructor(private http: HttpClient) {}

  cadastrarPeriferico(periferico: Periferico): Observable<Periferico> {
    return this.http.post<Periferico>(this.apiURL, periferico).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao cadastrar o periferico.';

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

  getPeriferico(): Observable<Periferico[]> {
    return this.http.get<Periferico[]>(this.apiURL).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar os perifericos.';

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

  getPerifericoById(id: string): Observable<Periferico> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Periferico>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar o periferico.';

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

  deletarPeriferico(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao deletar o periferico.';

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

  atualizarPeriferico(id: string, periferico: Periferico): Observable<Periferico> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Periferico>(url, periferico).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao atualizar o periferico.';

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
