import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  private ratesUrl = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL';
  private selicUrl = '';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<any> {
    return this.http.get<any>(this.ratesUrl).pipe(
      map((data) => ({
        dolar: parseFloat(data.USDBRL.bid),
        euro: parseFloat(data.EURBRL.bid),
      }))
    );
  }

  getSelicRate(): Observable<number> {
    return this.http.get<any>(this.selicUrl).pipe(
      map((data) => {
        console.log('Resposta da API Selic:', data);
        return parseFloat(data[0].valor);
      })
    );
  }
  
}
