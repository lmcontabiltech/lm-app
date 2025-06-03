import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Usuario } from '../login/usuario';
import { map } from 'rxjs/internal/operators/map';
import { Permissao } from '../login/permissao';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL: string = environment.apiURLBase + '/api/usuarios';
  tokenURL: string = environment.apiURLBase + environment.obterTokenUrl;
  clientID: string = environment.clientId;
  clientSecret: string = environment.clientSecret;
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  obterToken() {
    return localStorage.getItem('access_token');
  }

  encerrarSessao() {
    localStorage.removeItem('access_token');
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiURL}/recuperar-senha?email=${email}`, {});
  }

  resetPassword(token: string, newPassword: string) {
    const body = { newPassword: newPassword };
    return this.http.put(
      `${this.apiURL}/reset-password/${encodeURIComponent(token)}`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  obterUsuarioAutenticadoDoBackend(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiURL}/perfil`).pipe(
      map((usuario) => {
        // Presumindo que o backend retorne o role do usuário
        usuario.permissao = this.jwtHelper.decodeToken(
          JSON.stringify(this.obterToken())
        ).role;
        return usuario;
      })
    );
  }

  atualizarUsuario(
    usuario: Usuario,
    fotoDoPerfil?: File | null
  ): Observable<Usuario> {
    const formData: FormData = new FormData();
    formData.append(
      'usuario',
      new Blob([JSON.stringify(usuario)], { type: 'application/json' })
    );

    if (fotoDoPerfil) {
      formData.append('fotoDoPerfil', fotoDoPerfil);
    }

    return this.http
      .put<Usuario>(`${this.apiURL}/update/${usuario.id}`, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 422) {
            return throwError(
              'Já existe um usuário com este username na nossa base de dados. Tente outro'
            );
          }
          return throwError('O servidor não está funcionando corretamente.');
        })
      );
  }

  removerUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/delete/${id}`);
  }

  getUsuarioAutenticado(): Usuario | null {
    const userJson = localStorage.getItem('usuario'); // Assumindo que o usuário está salvo no localStorage
    if (userJson) {
      return JSON.parse(userJson); // Retorna o usuário como objeto
    }
    return null; // Retorna null se não houver usuário
  }

  getUserIdFromToken(): string | null {
    const token = this.obterToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.sub || null;
    }
    return null;
  }

  obterPerfilUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiURL}/token`).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao obter perfil do usuário:', error);
        return throwError(
          'Erro ao obter perfil do usuário. Por favor, tente novamente.'
        );
      })
    );
  }

  salvarUsuarioAutenticado(usuario: Usuario) {
    const token = this.obterToken();
    if (token) {
      const userId = this.getUserIdFromToken();
    }
  }

  isAuthenticated(): boolean {
    const token = this.obterToken();
    if (token) {
      const expired = this.jwtHelper.isTokenExpired(token);

      return !expired;
    }
    return false;
  }

  salvar(usuario: Usuario, perm: Permissao): Observable<any> {
    const { permissao: userPermissao } = this.getUsuarioAutenticado() || {};

    let request: Observable<any>;
    if (
      userPermissao === Permissao.ADMIN &&
      perm === Permissao.COORDENADOR.valueOf()
    ) {
      request = this.cadastrarCoordenador(usuario);
    } else {
      request = this.cadastrarColaborador(usuario);
    }

    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 422) {
          return throwError('usuário já cadastrado na base de dados');
        }
        return throwError(error);
      })
    );
  }

  private cadastrarColaborador(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiURL}/cadastro/USER`, usuario).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 422) {
          return throwError('Usuário já cadastrado na base de dados');
        }
        return throwError('O servidor não está funcionando corretamente.');
      })
    );
  }

  private cadastrarCoordenador(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiURL}/cadastro/COORDENADOR`, usuario).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 422) {
          return throwError('Usuário já cadastrado na base de dados');
        }
        return throwError('O servidor não está funcionando corretamente.');
      })
    );
  }

  public visualizarColaboradores(): Observable<Usuario[] | null> {
    return this.http
      .get<Usuario[]>(`${this.apiURL}/visualizar/COORDENADOR`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === 204) {
            return null;
          }
          return response.body || null;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(
            'Erro ao visualizar colaboradores. Por favor, tente novamente.'
          );
        })
      );
  }

  public visualizarUsuarios(): Observable<Usuario[] | null> {
    return this.http
      .get<Usuario[]>(`${this.apiURL}/visualizar/ADMIN`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === 204) {
            return null;
          }
          return response.body || null;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao visualizar os usuários: ', error);
          return throwError(
            'Erro ao visualizar os usuários. Por favor, tente novamente.'
          );
        })
      );
  }

  public visualizarUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiURL}/visualizarUsuario/${id}`);
  }

  tentarLogar(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('grant_type', 'password');

    const headers = {
      Authorization: 'Basic ' + btoa(`${this.clientID}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    return this.http.post(this.tokenURL, params.toString(), { headers });
  }
}
