import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ScannerResponse {
  file_id: string;
  errors: { [filename: string]: number[] };
}

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  apiURL: string = environment.apiURLBase;

  constructor(private http: HttpClient) {}

  checkServer(): Observable<any> {
    return this.http
      .get(`${this.apiURL}/`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  /** Envia arquivos para correção (primeiro é o correto, os demais são comparados) */
  enviarArquivosParaCorrecao(files: File[]): Observable<ScannerResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));
    return this.http
      .post<ScannerResponse>(`${this.apiURL}/scanner`, formData)
      .pipe(catchError((error) => throwError(() => error)));
  }

  /** Baixa o ZIP dos arquivos corrigidos */
  baixarArquivosCorrigidos(fileId: string): Observable<Blob> {
    return this.http
      .get(`${this.apiURL}/download/${fileId}`, { responseType: 'blob' })
      .pipe(catchError((error) => throwError(() => error)));
  }

  /** Limpa arquivos temporários do servidor */
  limparArquivosTemporarios(): Observable<any> {
    return this.http
      .get(`${this.apiURL}/clear`)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
