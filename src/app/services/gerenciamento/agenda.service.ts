import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agenda } from 'src/app/sistema/gerenciamento/agenda/enums/agenda';
import { Evento } from 'src/app/sistema/gerenciamento/agenda/evento';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  apiURL: string = environment.apiURLBase + '/api/eventos';

  constructor(private http: HttpClient) {}

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      const message =
        error.error instanceof ErrorEvent
          ? `Erro: ${error.error.message}`
          : `Erro no servidor: ${error.status} - ${error.message}`;
      console.error(`${operation} - ${message}`);
      return throwError(() => error);
    };
  }

  cadastrarEvento(usuarioId: number, evento: Evento): Observable<Evento> {
    const url = `${this.apiURL}/usuarios/${encodeURIComponent(
      String(usuarioId)
    )}`;
    return this.http
      .post<Evento>(url, evento)
      .pipe(catchError(this.handleError('Erro ao cadastrar o evento')));
  }

  atualizarEvento(
    usuarioId: number,
    eventoId: number,
    evento: Evento
  ): Observable<Evento> {
    const url = `${this.apiURL}/usuarios/${encodeURIComponent(
      String(usuarioId)
    )}/${encodeURIComponent(String(eventoId))}`;
    return this.http
      .put<Evento>(url, evento)
      .pipe(catchError(this.handleError('Erro ao atualizar o evento')));
  }

  listarEventosDoMes(usuarioId: number, mes: string): Observable<Evento[]> {
    const url = `${this.apiURL}/usuarios/${encodeURIComponent(
      String(usuarioId)
    )}/mes`;
    const params = new HttpParams().set('mes', mes);
    return this.http
      .get<Evento[]>(url, { params })
      .pipe(catchError(this.handleError('Erro ao buscar eventos do mês')));
  }

  listarEventosGeraisDoMes(mes: string): Observable<Evento[]> {
    const url = `${this.apiURL}/geral/mes`;
    const params = new HttpParams().set('mes', mes);
    return this.http
      .get<Evento[]>(url, { params })
      .pipe(
        catchError(this.handleError('Erro ao buscar eventos gerais do mês'))
      );
  }

  buscarEventoPorId(usuarioId: number, eventoId: number): Observable<Evento> {
    const url = `${this.apiURL}/usuarios/${encodeURIComponent(
      String(usuarioId)
    )}/eventos/${encodeURIComponent(String(eventoId))}`;
    return this.http
      .get<Evento>(url)
      .pipe(catchError(this.handleError('Erro ao buscar o evento')));
  }

  deletarEvento(usuarioId: number, eventoId: number): Observable<void> {
    const url = `${this.apiURL}/usuarios/${encodeURIComponent(
      String(usuarioId)
    )}/eventos/${encodeURIComponent(String(eventoId))}`;
    return this.http
      .delete<void>(url)
      .pipe(catchError(this.handleError('Erro ao deletar o evento')));
  }
}
