import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Atividade } from 'src/app/sistema/gerenciamento/atividades/atividades';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HistoricoAtividade } from 'src/app/sistema/gerenciamento/historico-atividades/historico';

interface UpdateCheckedDto {
  checked: boolean;
}

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
        console.error('Erro ao deletar atividade:', error);
        return throwError(() => error);
      })
    );
  }

  atualizarAtividade(id: string, atividade: Atividade): Observable<Atividade> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Atividade>(url, atividade).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Erro ao atualizar a empresa:', error);
        return throwError(() => error);
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

  getHistoricoAtividades(): Observable<HistoricoAtividade[]> {
    return this.http.get<HistoricoAtividade[]>(`${this.apiURL}/historico`).pipe(
      map((res) => res || []),
      catchError((error: HttpErrorResponse) => {
        let msg = 'Erro ao buscar histórico de atividades.';
        if (error.error instanceof ErrorEvent) {
          msg = `Erro de rede: ${error.error.message}`;
        } else if (error.error?.message) {
          msg = error.error.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  getHistoricoAtividadesPorUsuario(
    userId: number
  ): Observable<HistoricoAtividade[]> {
    return this.http
      .get<HistoricoAtividade[]>(`${this.apiURL}/historico/user/${userId}`)
      .pipe(
        map((res) => {
          console.log(
            'Resposta bruta do backend (histórico por usuário):',
            res
          );
          console.log('Tipo da resposta:', typeof res);
          console.log('É array?', Array.isArray(res));
          if (Array.isArray(res)) {
            console.log('Quantidade de itens:', res.length);
            if (res.length > 0) {
              console.log('Primeiro item:', res[0]);
            }
          }
          return res || [];
        }),
        catchError((error: HttpErrorResponse) => {
          let msg = 'Erro ao buscar histórico do usuário.';
          if (error.error instanceof ErrorEvent) {
            msg = `Erro de rede: ${error.error.message}`;
          } else if (error.error?.message) {
            msg = error.error.message;
          }
          return throwError(() => new Error(msg));
        })
      );
  }

  removerUsuarioDaAtividade(
    atividadeId: number,
    usuarioId: number
  ): Observable<any> {
    const url = `${this.apiURL}/${atividadeId}/usuario/${usuarioId}`;
    return this.http.delete(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let msg = 'Erro ao remover usuário da atividade.';
        if (error.error instanceof ErrorEvent) {
          msg = `Erro de rede: ${error.error.message}`;
        } else if (error.error?.message) {
          msg = error.error.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  removerTarefaDaAtividade(
    atividadeId: number,
    tarefaId: number
  ): Observable<any> {
    const url = `${this.apiURL}/${atividadeId}/tarefa/${tarefaId}`;
    return this.http.delete(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let msg = 'Erro ao remover tarefa da atividade.';
        if (error.error instanceof ErrorEvent) {
          msg = `Erro de rede: ${error.error.message}`;
        } else if (error.error?.message) {
          msg = error.error.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  atualizarStatusCheckedSubprocesso(
    atividadeId: number,
    subprocessoId: number,
    checked: boolean
  ): Observable<any> {
    const url = `${this.apiURL}/${atividadeId}/subprocessos/${subprocessoId}/checked`;
    const dto: UpdateCheckedDto = { checked };

    return this.http.patch(url, dto).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro ao atualizar status da tarefa.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro de rede: ${error.error.message}`;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status) {
          errorMessage = `Erro no servidor: ${error.status} - ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getAtividadesPorEmpresas(idsEmpresas: number[]): Observable<any> {
    const params: any = {};
    if (idsEmpresas && idsEmpresas.length > 0) {
      params.idsEmpresas = idsEmpresas;
    }

    return this.http
      .get<any>(`${this.apiURL}/atividades/por-empresas`, { params })
      .pipe(
        map((response) => {
          console.log('Response do backend:', response);
          return response.atividades ? response.atividades : response;
        }),
        catchError((error) => {
          let errorMessage = 'Erro ao buscar atividades por empresas.';

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
