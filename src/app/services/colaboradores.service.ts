import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresService {

  apiURL: string = environment.apiURLBase + '/api/colaboradores';
  
  constructor(private http: HttpClient) {}

}
