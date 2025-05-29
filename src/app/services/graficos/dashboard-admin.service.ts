import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Processo } from 'src/app/sistema/gerenciamento/processos/processo';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface GraficoSetor {
  concluidas: number;
  setor: string;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardAdminService {
  apiURL: string = environment.apiURLBase + '/api/grafico';

  constructor(private http: HttpClient) {}

  getAtividadesConcluidasPorSetor(setor: string): Observable<GraficoSetor> {
    const url = `${this.apiURL}/${encodeURIComponent(setor)}`;
    return this.http.get<GraficoSetor>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage =
          'Erro ao buscar dados de atividades concluídas por setor.';
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
