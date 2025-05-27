import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {

  apiURL: string = environment.apiURLBase + '/api/selic';
  private ratesUrl ='https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<any> {
    return this.http.get<any>(this.ratesUrl).pipe(
      map((data) => {
        console.log('Dados retornados pela API:', data);
        return {
          dolar: parseFloat(data.USDBRL.bid),
          euro: parseFloat(data.EURBRL.bid), 
        };
      })
    );
  }

  getSelicRate(): Observable<number> {
    return this.http.get<any[]>(this.apiURL).pipe(
      map((data) => {
        console.log('Resposta da API Selic via backend:', data);
        return parseFloat(data[0].valor.replace(',', '.'));
      })
    );
  }
}
