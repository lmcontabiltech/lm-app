import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Processo } from 'src/app/sistema/gerenciamento/processos/processo';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProcessoService {
  apiURL: string = environment.apiURLBase + '/api/processo';

  constructor(private http: HttpClient) {}

  cadastrarProcesso(processo: Processo): Observable<Processo> {
    return this.http.post<Processo>(this.apiURL, processo).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao cadastrar a processo.';

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
