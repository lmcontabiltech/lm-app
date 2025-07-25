import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from './usuario';
import { Permissao } from './permissao';
import { Setor } from '../sistema/administrativo/cadastro-de-colaborador/setor';
import { ThemeService } from '../services/modo-escuro/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  nome: string = '';
  email: string = '';
  cadastrando: boolean = false;
  mensagemSucesso: string = '';
  errors: string[] = [];
  forgotEmail: string = '';
  showForgotPassword: boolean = false;
  usuario!: Usuario | null;
  permissaoUsuario: Permissao = Permissao.USER;
  setorUsuario!: Setor;

  confirmPasswordError: string | null = null;
  confirmPassword: string = '';
  consentimento: boolean = false;

  showTooltip: boolean = false;
  passwordValidations = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  };

  passwordVisible: { [key: string]: boolean } = {
    password: false,
    confirmPassword: false,
  };

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private themeService: ThemeService
  ) {}

  onSubmit() {
    this.authService.tentarLogar(this.email, this.password).subscribe(
      (response: any) => {
        const access_token = response.access_token;
        localStorage.setItem('access_token', access_token);
  
        const userId = this.authService.getUserIdFromToken() ?? '';
        localStorage.setItem('user_id', userId || '');
  
        const usuario: Usuario = {
          id: userId,
          fotoUrl: null,
          username: response.username,
          password: '',
          email: response.email || '',
          nome: response.nome || '',
          confirmPassword: '',
          tipoUsuario: '',
          permissao: response.authorities.length > 0 ? response.authorities[0] : null,
          setor: response.setor || null,
          darkMode: response.darkMode || false,
        };
        localStorage.setItem('usuario', JSON.stringify(usuario));
  
        this.themeService.loadDarkModeFromServer();
  
        switch (usuario.permissao) {
          case Permissao.ADMIN:
            this.router.navigate(['/usuario/dashboard-admin']);
            break;
          case Permissao.COORDENADOR:
            this.router.navigate(['/usuario/dashboard-coordenador']);
            break;
          case Permissao.USER:
          case Permissao.ESTAGIARIO:
            this.router.navigate(['/usuario/dashboard-colaborador']);
            break;
          default:
            this.router.navigate(['/login']);
            break;
        }
      },
      (errorResponse) => {
        this.errors = ['Usuário e/ou senha incorreto(s).'];
      }
    );
  }  

  preparaCadastrar(event: Event) {
    event.preventDefault();
    this.cadastrando = true;
    this.showForgotPassword = false;
  }

  cancelaCadastro() {
    this.cadastrando = false;
  }

  cadastrar() {
    this.errors = [];
    if (
      this.password.length < 8 ||
      !/[A-Z]/.test(this.password) ||
      !/[a-z]/.test(this.password) ||
      !/[0-9]/.test(this.password) ||
      !/[!@#$%^&*]/.test(this.password)
    ) {
      this.errors.push(
        'A senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.'
      );
    }
    if (!this.username || !this.email || !this.nome) {
      this.errors.push('Todos os campos obrigatórios devem ser preenchidos.');
    }
    if (this.password !== this.confirmPassword) {
      this.errors.push('As senhas não coincidem.');
    }
    if (this.errors.length > 0) return;

    const usuario: Usuario = {
      id: '',
      fotoUrl: null,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,
      email: this.email,
      nome: this.nome,
      tipoUsuario: '',
      permissao: this.permissaoUsuario,
      setor: this.setorUsuario,
      darkMode: false,
    };

    this.authService.salvar(usuario, this.permissaoUsuario).subscribe(
      (response) => {
        this.mensagemSucesso =
          'Cadastro realizado com sucesso! Efetue o login.';
        this.cadastrando = false;
        this.errors = [];
      },
      (errorResponse) => {
        if (errorResponse.status === 400) {
          this.errors = [errorResponse.error];
        } else {
          this.errors = ['Erro ao cadastrar o usuário.'];
        }
      }
    );
  }

  salvaUserLocal() {
    this.authService.obterUsuarioAutenticadoDoBackend().subscribe(
      (usuario: Usuario) => {
        this.usuario = usuario;
        localStorage.setItem('idUser', usuario.id);
        this.router.navigate(['/usuario/inicio']);
        localStorage.setItem('usuario', usuario.username);
      },
      (error) => {
        console.error('Erro ao obter dados do usuário:', error);
      }
    );
  }

  forgotPassword(event: Event) {
    event.preventDefault();
    this.showForgotPassword = true;
    this.cadastrando = false;
  }

  sendForgotPasswordEmail() {
    this.authService.forgotPassword(this.forgotEmail).subscribe(
      (response: any) => {
        this.mensagemSucesso = response.message;
        this.showForgotPassword = false;
        this.forgotEmail = '';
      },
      (error) => {
        console.log(error);
        if (error.status === 400) {
          this.errors = ['E-mail não encontrado ou inválido.'];
        } else if (error.status === 500) {
          this.errors = ['Erro ao enviar e-mail de recuperação de senha.'];
        } else {
          this.errors = [
            'Erro desconhecido ao enviar e-mail de recuperação de senha.',
          ];
        }
      }
    );
  }

  cancelForgotPassword() {
    this.showForgotPassword = false;
    this.forgotEmail = '';
  }

  validatePassword() {
    this.passwordValidations.minLength = this.password.length >= 8;
    this.passwordValidations.uppercase = /[A-Z]/.test(this.password);
    this.passwordValidations.lowercase = /[a-z]/.test(this.password);
    this.passwordValidations.number = /\d/.test(this.password);
    this.passwordValidations.specialChar = /[!@#$%^&*]/.test(this.password);
  }

  togglePasswordVisibility(field: string) {
    this.passwordVisible[field] = !this.passwordVisible[field];
    const passwordInput = document.querySelector(`input[name="${field}"]`);
    if (passwordInput) {
      passwordInput.setAttribute(
        'type',
        this.passwordVisible[field] ? 'text' : 'password'
      );
    }
  }

  validateConfirmPassword() {
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'As senhas não coincidem';
    } else {
      this.confirmPasswordError = null;
    }
  }
}
