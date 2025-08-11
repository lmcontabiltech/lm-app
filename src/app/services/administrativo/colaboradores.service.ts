import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { Usuario } from '../../login/usuario';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ColaboradoresService {
  apiURL: string = environment.apiURLBase + '/api/usuarios';

  constructor(private http: HttpClient) {}

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiURL, usuario).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao salvar a aula.';

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

  getUsuarioById(id: string): Observable<Usuario> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Usuario>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar o usuário.';

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

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiURL).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar os usuários.';

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

  getUsuariosNonAdmin(): Observable<Usuario[]> {
    const url = `${this.apiURL}/usuarios-non-admin`;
    return this.http.get<Usuario[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar os usuários não administradores.';

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

  deleteUsuarioById(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao deletar o usuário.';

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

  atualizarUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<Usuario>(url, usuario).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao atualizar o usuário.';

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

  getUsuarioByToken(): Observable<Usuario> {
    const url = `${this.apiURL}/token`;
    return this.http.get<Usuario>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar o usuário pelo token.';

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

  getUsuariosBySetor(setor: string): Observable<Usuario[]> {
    const url = `${this.apiURL}/setor/${setor}`;
    return this.http.get<Usuario[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar os usuários pelo setor.';

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

  buscarUsuariosPorNome(nome: string): Observable<Usuario[]> {
    const url = `${this.apiURL}/search?search=${encodeURIComponent(nome)}`;
    return this.http.get<Usuario[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar usuários por nome.';
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

  enviarRecuperacaoSenha(email: string): Observable<any> {
    const url = `${this.apiURL}/recover-password?email=${encodeURIComponent(
      email
    )}`;
    return this.http.post(url, null).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro ao enviar e-mail de recuperação de senha.';
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

  FiltroUsuariosBySetores(setores: string[]): Observable<Usuario[]> {
    if (!setores || setores.length === 0) {
      return this.getUsuariosNonAdmin();
    }
    const params = setores
      .map((s) => `setors=${encodeURIComponent(s)}`)
      .join('&');
    const url = `${this.apiURL}/setor?${params}`;
    return this.http.get<Usuario[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar usuários pelos setores.';
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

  atualizarPerfilUsuario(id: number, formData: FormData): Observable<any> {
    const url = `${this.apiURL}/perfil/${id}`;
    console.log('Dados enviados para o backend (atualizar perfil):');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    return this.http.put<any>(url, formData).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro bruto recebido do servidor:', error);

        let errorMessage = 'Erro ao atualizar o perfil do usuário.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            const firstErrorKey = Object.keys(error.error.errors)[0];
            errorMessage = error.error.errors[firstErrorKey];
          }
        }

        console.error('Mensagem de erro processada:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUsuariosInativos(): Observable<Usuario[]> {
    const url = `${this.apiURL}/inativos`;
    return this.http.get<Usuario[]>(url).pipe(
      map((response) => response),
      catchError((error) => {
        let errorMessage = 'Erro ao buscar os usuários inativos.';

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

  buscarUsuariosInativosPorNome(nome: string): Observable<Usuario[]> {
    if (!nome || nome.trim() === '') {
      return this.getUsuariosInativos();
    }

    const url = `${this.apiURL}/inativos/search?search=${encodeURIComponent(
      nome.trim()
    )}`;

    return this.http.get<Usuario[]>(url).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  filtroUsuariosInativosPorSetor(setor: string): Observable<Usuario[]> {
    if (!setor || setor.trim() === '') {
      return this.getUsuariosInativos();
    }

    const setoresValidos = [
      'CONTABIL',
      'FISCAL',
      'PESSOAL',
      'FINANCEIRO',
      'PARALEGAL',
    ];
    const setorFormatado = setor.trim().toUpperCase();

    if (!setoresValidos.includes(setorFormatado)) {
      return throwError(
        () =>
          new Error(
            `Setor inválido: ${setor}. Setores válidos: ${setoresValidos.join(
              ', '
            )}`
          )
      );
    }

    const url = `${this.apiURL}/inativos/setor/${encodeURIComponent(
      setorFormatado
    )}`;

    return this.http.get<Usuario[]>(url).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  redefinirSenha(dto: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    const url = `${this.apiURL}/newPassword`;
    return this.http.put<any>(url, dto).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Erro no servidor:', error);
        return throwError(() => error);
      })
    );
  }

  enviarEmailSuporte(mensagem: string): Observable<any> {
    const url = `${this.apiURL}/email/suporte`;
    const requestDTO = { mensagem };
    return this.http.post<any>(url, requestDTO).pipe(
      catchError((error) => {
        let errorMessage = 'Erro ao enviar e-mail para o suporte.';
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
