import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  apiURL: string = environment.apiURLBase + '/api/empresas';
    
  constructor(private http: HttpClient) {}
}
