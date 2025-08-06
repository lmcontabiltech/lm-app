import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardAtividadesPorSetorResponseDTO } from 'src/app/sistema/dashboards/dashboard-admin/models/atividades-por-setor';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';

@Injectable({
  providedIn: 'root',
})
export class DashboardColaboradorService {
  apiURL: string = environment.apiURLBase + '/api/grafico';

  constructor(private http: HttpClient) {}

  getAtividadesResumoSetor(
    setor: Setor,
    dataInicio: string
  ): Observable<DashboardAtividadesPorSetorResponseDTO> {
    const url = `${this.apiURL}/atividades/resumo`;
    const params = {
      setor: setor,
      dataInicio: dataInicio,
    };

    return this.http
      .get<DashboardAtividadesPorSetorResponseDTO>(url, { params })
      .pipe(
        map((response) => response),
        catchError((error) => {
          let errorMessage = `Erro ao buscar resumo de atividades para o setor ${setor}.`;
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

  getResumoAtividadesUsuario(): Observable<{
    concluidas: number;
    emAndamento: number;
    totalAtribuidas: number;
  }> {
    const url = `${this.apiURL}/usuarios/resumo`;
    return this.http
      .get<{
        concluidas: number;
        emAndamento: number;
        totalAtribuidas: number;
      }>(url)
      .pipe(
        catchError((error) => {
          let errorMessage = 'Erro ao buscar resumo das atividades do usuário.';
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

  getAtividadesPorMesSetor(setor: Setor): Observable<{
    total: number;
    valoresPorMes: { mes: string; quantidade: number }[];
  }> {
    const url = `${this.apiURL}/atividades/por-mes/setor/${setor}`;
    return this.http
      .get<{
        total: number;
        valoresPorMes: { mes: string; quantidade: number }[];
      }>(url)
      .pipe(
        catchError((error) => {
          let errorMessage = `Erro ao buscar métricas de atividades por mês para o setor ${setor}.`;
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
