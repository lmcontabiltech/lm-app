import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Processo } from 'src/app/sistema/gerenciamento/processos/processo';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GraficoFuncionariosPorSetor } from 'src/app/sistema/dashboards/dashboard-admin/models/funcionarios-por-setor';
import { GraficoAtividadesPorMes } from 'src/app/sistema/dashboards/dashboard-admin/models/atividades-por-mes';
import { GraficoEmpresasPorRegime } from 'src/app/sistema/dashboards/dashboard-admin/models/empresa-por-regime';
import { DashboardAtividadesPorSetorResponseDTO } from 'src/app/sistema/dashboards/dashboard-admin/models/atividades-por-setor';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';

export interface GraficoSetor {
  concluidas: number;
  setor: string;
  total: number;
}

export interface GraficoQuantidade {
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

  getQuantidadeUsuarios(): Observable<GraficoQuantidade> {
    const url = `${this.apiURL}/usuarios`;
    return this.http.get<GraficoQuantidade>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar quantidade de colaboradores.';
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

  getQuantidadeEmpresasNumero(): Observable<GraficoQuantidade> {
    const url = `${this.apiURL}/empresas`;
    return this.http.get<GraficoQuantidade>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar quantidade de empresas.';
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

  getQuantidadeAtividadesNaoAtribuidas(): Observable<GraficoQuantidade> {
    const url = `${this.apiURL}/atividades`;
    return this.http.get<GraficoQuantidade>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage =
          'Erro ao buscar quantidade de atividades não atribuídas.';
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

  getFuncionariosPorSetor(): Observable<GraficoFuncionariosPorSetor> {
    const url = `${this.apiURL}/funcionarios/setor`;
    return this.http.get<GraficoFuncionariosPorSetor>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage =
          'Erro ao buscar quantidade de funcionários por setor.';
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

  getAtividadesPorMes(): Observable<GraficoAtividadesPorMes> {
    const url = `${this.apiURL}/atividades/por-mes`;
    return this.http.get<GraficoAtividadesPorMes>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar atividades por mês.';
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

  getEmpresasPorRegime(): Observable<GraficoEmpresasPorRegime> {
    const url = `${this.apiURL}/empresas/regime`;
    return this.http.get<GraficoEmpresasPorRegime>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar empresas por regime.';
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
}
