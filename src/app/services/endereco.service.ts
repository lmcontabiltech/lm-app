import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Estado {
  nome: string;
  sigla: string;
}

export const listaEstados: Estado[] = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private readonly _apiBaseUrl =
    'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private readonly http: HttpClient) {}

  getEstados(): Observable<Estado[]> {
    return of(listaEstados);
  }

  getCidadesByEstado(sigla: string): Observable<{ nome: string }[]> {
    const url = `${this._apiBaseUrl}/estados/${sigla}/municipios`;
    return this.http.get<{ nome: string }[]>(url).pipe(
      catchError((error) => {
        console.error('Erro ao buscar cidades por estado:', error);
        return of([]);
      })
    );
  }

  getNomeEstado(estadoNome: string): Observable<any[]> {
    const url = `${this._apiBaseUrl}/estados`;
    return this.http.get<any[]>(url).pipe(
      map((estados) =>
        estados.find(
          (estado) => estado.nome.toLowerCase() === estadoNome.toLowerCase()
        )
      ),
      switchMap((estado) => {
        if (estado && estado.sigla) {
          return this.getCidadesByEstado(estado.sigla);
        } else {
          console.error('Estado não encontrado');
          return of([]);
        }
      }),
      catchError((error) => {
        console.error('Erro ao buscar estado', error);
        return of([]);
      })
    );
  }

  getTodasCidades(): Observable<{ nome: string }[]> {
    const url = `${this._apiBaseUrl}/municipios`;
    return this.http.get<{ nome: string }[]>(url).pipe(
      catchError((error) => {
        console.error('Erro ao buscar todas as cidades', error);
        return of([]);
      })
    );
  }

  getPaises(): Observable<{ nome: string; sigla: string }[]> {
    const url = `${this._apiBaseUrl}/paises`;
    return this.http.get<any[]>(url).pipe(
      map((paises) =>
        paises.map((pais) => ({
          nome: pais.nome,
          sigla: pais.id['ISO-ALPHA-3'],
        }))
      ),
      catchError((error) => {
        console.error('Erro ao buscar a lista de países:', error);
        return of([]);
      })
    );
  }
}
