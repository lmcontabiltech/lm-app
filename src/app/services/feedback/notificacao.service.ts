import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notificacao } from 'src/app/sistema/notificacoes/notificacao';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  apiURL: string = environment.apiURLBase + '/api/notificacoes';

  constructor(private http: HttpClient) {}

  getNotificacoes(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(this.apiURL).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        return response.notificacoes || response.data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar notificações:', error);
        return throwError(() => error);
      })
    );
  }

  getContadorNaoLidas(): Observable<number> {
    return this.http.get<number>(`${this.apiURL}/contador-nao-lidas`).pipe(
      map((response: any) => {
        if (typeof response === 'number') {
          return response;
        }
        return response.contador || response.count || response.total || 0;
      }),
      catchError((error) => {
        console.error(
          'Erro ao buscar contador de notificações não lidas:',
          error
        );
        return throwError(() => error);
      })
    );
  }

  getNotificacoesPorFiltro(lidas: boolean): Observable<Notificacao[]> {
    const params = new HttpParams().set('lidas', lidas.toString());

    return this.http
      .get<Notificacao[]>(`${this.apiURL}/filtro`, { params })
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          }
          return response.notificacoes || response.data || [];
        }),
        catchError((error) => {
          console.error('Erro ao buscar notificações por filtro:', error);
          return throwError(() => error);
        })
      );
  }

  getNotificacoesRecentes(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(`${this.apiURL}/recentes`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        return response.notificacoes || response.data || [];
      }),
      catchError((error) => {
        console.error('Erro ao buscar notificações recentes:', error);
        return throwError(() => error);
      })
    );
  }

  marcarComoLida(notificacaoId: number): Observable<void> {
    const url = `${this.apiURL}/${notificacaoId}/marcar-como-lida`;

    return this.http.put<void>(url, {}).pipe(
      tap((response) => {
        console.log('✅ Resposta da API:', response);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  marcarTodasComoLidas(): Observable<number> {
    return this.http
      .put<number>(`${this.apiURL}/marcar-todas-como-lidas`, {})
      .pipe(
        map((response: any) => {
          if (typeof response === 'number') {
            return response;
          }
          return response.count || response.total || response.marcadas || 0;
        }),
        catchError((error) => {
          console.error(
            'Erro ao marcar todas as notificações como lidas:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  getNotificacoesTempoReal(): Observable<Notificacao> {
    return new Observable<Notificacao>((observer) => {
      const eventSource = new EventSource(`${this.apiURL}/notificacoes`);

      eventSource.onmessage = (event) => {
        try {
          const notificacao = JSON.parse(event.data);
          observer.next(notificacao);
        } catch (error) {
          console.error('Erro ao parsear notificação em tempo real:', error);
          observer.error(error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Erro na conexão SSE:', error);
        observer.error(error);
      };

      eventSource.onopen = () => {
        console.log('Conexão SSE estabelecida para notificações');
      };

      return () => {
        console.log('Fechando conexão SSE de notificações');
        eventSource.close();
      };
    });
  }
}
