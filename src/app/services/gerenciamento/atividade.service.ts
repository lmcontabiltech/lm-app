import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Atividade } from 'src/app/sistema/gerenciamento/atividades/atividades';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AtividadeService {
  apiURL: string = environment.apiURLBase + '/api/atividade';

  constructor(private http: HttpClient) {}

  cadastrarAtividade(atividade: Atividade): Observable<Atividade> {
    return this.http.post<Atividade>(this.apiURL, atividade).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao cadastrar a atividade.';

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

  getAtividades(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(this.apiURL).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar as atividades.';

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

  getAtividadeById(id: string): Observable<Atividade> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Atividade>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar a atividade.';

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

  deletarAtividade(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao deletar o atividade.';

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

  atualizarAtividade(id: string, atividade: Atividade): Observable<Atividade> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Atividade>(url, atividade).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao atualizar a atividade.';

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

  atualizarStatusAtividade(
    id: number | string,
    status: string
  ): Observable<any> {
    const url = `${this.apiURL}/${id}/status`;
    return this.http
      .put(url, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          let errorMessage = 'Erro ao atualizar o status da atividade.';
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

  getAtividadesPorFiltro(filtro: {
    atribuidas_a_mim?: boolean;
    concluido?: boolean;
    sem_membros?: boolean;
    setores?: string[];
    startDate?: string;
    user_ids?: number[];
  }): Observable<Atividade[]> {
    const params: any = {};

    if (filtro.atribuidas_a_mim !== undefined)
      params.atribuidas_a_mim = filtro.atribuidas_a_mim;
    if (filtro.concluido !== undefined) params.concluido = filtro.concluido;
    if (filtro.sem_membros !== undefined)
      params.sem_membros = filtro.sem_membros;
    if (filtro.setores && filtro.setores.length > 0)
      params.setores = filtro.setores.join(',');
    if (filtro.startDate) params.startDate = filtro.startDate;
    if (filtro.user_ids && filtro.user_ids.length > 0)
      params.user_ids = filtro.user_ids;

    console.log('Requisição GET /filtro:', {
      url: `${this.apiURL}/filtro`,
      params,
    });

    return this.http.get<Atividade[]>(`${this.apiURL}/filtro`, { params }).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao buscar atividades por filtro.';
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
