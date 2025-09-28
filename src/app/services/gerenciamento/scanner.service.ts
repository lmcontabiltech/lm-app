import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ScannerRunResponseDTO } from 'src/app/sistema/gerenciamento/scanner/scanner';

export interface ScannerResponse {
  id: number;
  file_id: string;
  errors: { [filename: string]: number[] };
  corrections: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  apiURL: string = environment.apiURLBase + '/api/ia/scanner';

  constructor(private http: HttpClient) {}

  checkServer(): Observable<any> {
    return this.http
      .get(`${this.apiURL}/`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  enviarArquivosParaScanner(
    arquivosCorretos: File[],
    arquivosIncorretos: File[],
    meta?: string
  ): Observable<ScannerResponse> {
    const formData = new FormData();

    arquivosCorretos.forEach((file) =>
      formData.append('correct', file, file.name)
    );
    arquivosIncorretos.forEach((file) =>
      formData.append('incorrect', file, file.name)
    );
    if (meta) {
      formData.append('meta', meta);
    }

    return this.http
      .post<ScannerResponse>(`${this.apiURL}`, formData)
      .pipe(catchError((error) => throwError(() => error)));
  }

  listarExecucoesScanner(): Observable<ScannerRunResponseDTO[]> {
    return this.http
      .get<ScannerRunResponseDTO[]>(`${this.apiURL}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  buscarExecucaoScannerPorId(
    id: number | string
  ): Observable<ScannerRunResponseDTO> {
    return this.http
      .get<ScannerRunResponseDTO>(`${this.apiURL}/${id}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  listarExecucoesScannerPorEmpresa(
    empresaId: number | string
  ): Observable<ScannerRunResponseDTO[]> {
    const url = `${this.apiURL}/empresa/${empresaId}`;
    return this.http
      .get<ScannerRunResponseDTO[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }

  baixarCorrecaoZip(runId: number | string): Observable<Blob> {
    const url = `${this.apiURL}/${runId}/corrections/download`;
    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(catchError((error) => throwError(() => error)));
  }

  baixarRelatorioScanner(runId: number | string): Observable<Blob> {
    const url = `${this.apiURL}/${runId}/report/download`;
    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(catchError((error) => throwError(() => error)));
  }
}
