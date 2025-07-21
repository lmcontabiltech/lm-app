import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notificacao } from 'src/app/sistema/notificacoes/notificacao';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  apiURL: string = environment.apiURLBase + '/api/notificacoes';

  private contadorNaoLidasSubject = new BehaviorSubject<number>(0);
  public contadorNaoLidas$ = this.contadorNaoLidasSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

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
        const contador =
          typeof response === 'number'
            ? response
            : response.contador || response.count || response.total || 0;

        this.contadorNaoLidasSubject.next(contador);
        console.log('🔄 BehaviorSubject sincronizado com servidor:', contador);

        return contador;
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

  atualizarContadorGlobal(): void {
    console.log('🔄 Atualizando contador global...');
    this.getContadorNaoLidas().subscribe({
      next: (contador) => {
        console.log('✅ Contador global atualizado para:', contador);
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar contador global:', error);
      },
    });
  }

  incrementarContador(): void {
    const contadorAtual = this.contadorNaoLidasSubject.value;
    this.contadorNaoLidasSubject.next(contadorAtual + 1);
    console.log('➕ Contador incrementado para:', contadorAtual + 1);
  }


  decrementarContador(): void {
    const contadorAtual = this.contadorNaoLidasSubject.value;
    if (contadorAtual > 0) {
      this.contadorNaoLidasSubject.next(contadorAtual - 1);
      console.log('➖ Contador decrementado para:', contadorAtual - 1);
    }
  }

  marcarComoLida(notificacaoId: number): Observable<void> {
    const url = `${this.apiURL}/${notificacaoId}/marcar-como-lida`;

    return this.http.put<void>(url, {}).pipe(
      tap((response) => {
        console.log('✅ Notificação marcada como lida:', notificacaoId);
        this.decrementarContador();
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
          const quantidadeMarcadas =
            typeof response === 'number'
              ? response
              : response.count || response.total || response.marcadas || 0;

          // Zera contador local
          this.contadorNaoLidasSubject.next(0);
          console.log('🔄 Contador zerado após marcar todas como lidas');

          return quantidadeMarcadas;
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
      const token = this.authService.obterToken();

      if (!token) {
        observer.error(new Error('Token de autenticação necessário'));
        return;
      }

      if (!this.authService.isAuthenticated()) {
        observer.error(new Error('Usuário não autenticado'));
        return;
      }

      const sseUrl = `${this.apiURL}/notificacoes`;

      console.log('🔗 Conectando ao SSE com token do AuthService:', sseUrl);
      console.log('🔑 Token preview:', token.substring(0, 50) + '...');

      const controller = new AbortController();

      fetch(sseUrl, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Token de autenticação inválido ou expirado');
            } else if (response.status === 403) {
              throw new Error(
                'Sem permissão para acessar notificações em tempo real'
              );
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          console.log('✅ Conexão SSE estabelecida com Authorization header');

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('ReadableStream não disponível');
          }

          const decoder = new TextDecoder();
          let buffer = '';

          const readStream = async () => {
            try {
              while (true) {
                const { done, value } = await reader.read();

                if (done) {
                  console.log('🔗 Stream SSE finalizada');
                  observer.complete();
                  break;
                }

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                  this.processarLinhaSSE(line, observer);
                }
              }
            } catch (error) {
              observer.error(error);
            }
          };

          readStream();
        })
        .catch((error) => {
          observer.error(error);
        });

      return () => {
        controller.abort();
      };
    });
  }

  private processarLinhaSSE(line: string, observer: any): void {
    const trimmedLine = line.trim();

    // Log de todas as linhas recebidas para debug
    if (trimmedLine) {
      console.log('📝 Linha SSE recebida:', trimmedLine);
    }

    // Processar linha de dados SSE
    if (trimmedLine.startsWith('data: ')) {
      try {
        const data = trimmedLine.substring(6);

        if (data.trim()) {
          console.log('📨 Dados SSE recebidos:', data);
          const notificacao = JSON.parse(data);
          console.log('🎯 Notificação parseada:', notificacao);
          observer.next(notificacao);
        }
      } catch (error) {
        console.error('❌ Erro ao parsear dados SSE:', error, 'Linha:', line);
      }
    }

    // Log de outros tipos de linha SSE
    if (trimmedLine.startsWith('event: ')) {
      console.log('🏷️ Evento SSE:', trimmedLine);
    }

    if (trimmedLine.startsWith('id: ')) {
      console.log('🆔 ID SSE:', trimmedLine);
    }

    if (trimmedLine.startsWith('retry: ')) {
      console.log('🔄 Retry SSE:', trimmedLine);
    }
  }
}
