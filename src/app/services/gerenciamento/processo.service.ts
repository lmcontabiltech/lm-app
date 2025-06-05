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
        let errorMessage = 'Erro ao cadastrar o processo.';

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

  getProcessos(): Observable<Processo[]> {
    return this.http.get<Processo[]>(this.apiURL).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar os processos.';

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

  getProcessoById(id: string): Observable<Processo> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Processo>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar o processo.';

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

  deletarProcesso(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao deletar o processo.';

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

  atualizarProcesso(id: string, processo: Processo): Observable<Processo> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Processo>(url, processo).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao atualizar o processo.';

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

  getProcessosBySetores(setores: string[]): Observable<Processo[]> {
    if (!setores || setores.length === 0) {
      return this.getProcessos();
    }
    const params = setores
      .map((s) => `setors=${encodeURIComponent(s)}`)
      .join('&');
    const url = `${this.apiURL}/setor?${params}`;
    return this.http.get<Processo[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar processos pelos setores.';
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
