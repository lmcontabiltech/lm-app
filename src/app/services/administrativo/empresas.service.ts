import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Empresa } from '../../sistema/administrativo/empresas/empresa';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmpresasService {
  apiURL: string = environment.apiURLBase + '/api/empresa';

  constructor(private http: HttpClient) {}

  cadastrarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiURL, empresa).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Erro ao cadastrar a empresa:', error);
        return throwError(() => error);
      })
    );
  }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiURL).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Erro no servidor:', error);
        return throwError(() => error);
      })
    );
  }

  getEmpresaById(id: string): Observable<Empresa> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Empresa>(url).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Erro no servidor:', error);
        return throwError(() => error);
      })
    );
  }

  deletarEmpresa(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Erro no servidor:', error);
        return throwError(() => error);
      })
    );
  }

  atualizarEmpresa(id: string, empresa: Empresa): Observable<Empresa> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Empresa>(url, empresa).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Erro ao atualizar a empresa:', error);
        return throwError(() => error);
      })
    );
  }

  buscarEmpresasPorNome(razaoSocial: string): Observable<Empresa[]> {
    const url = `${this.apiURL}/search?search=${encodeURIComponent(
      razaoSocial
    )}`;
    return this.http.get<Empresa[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar empresas por razão social.';
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

  getEmpresasPorRegime(
    regime: string,
    unidade?: string
  ): Observable<Empresa[]> {
    const params: any = { regime };
    if (unidade) params.unidade = unidade;

    const url = `${this.apiURL}/filtro`;
    return this.http.get<Empresa[]>(url, { params }).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao buscar empresas pelo regime.';
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

  getEmpresasInativas(): Observable<Empresa[]> {
    const url = `${this.apiURL}/inativas`;
    return this.http.get<Empresa[]>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao buscar empresas inativas.';
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

  getEmpresasInativasPorRegime(
    regime: string,
    unidade?: string
  ): Observable<Empresa[]> {
    const params: any = { regime };
    if (unidade) params.unidade = unidade;

    const url = `${this.apiURL}/inativas/filtro`;
    return this.http.get<Empresa[]>(url, { params }).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao buscar empresas inativas pelo regime.';
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

  buscarEmpresasInativasPorNome(razaoSocial: string): Observable<Empresa[]> {
    const url = `${this.apiURL}/inativas/search?search=${encodeURIComponent(
      razaoSocial
    )}`;
    return this.http.get<Empresa[]>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao buscar empresas inativas por razão social.';
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
