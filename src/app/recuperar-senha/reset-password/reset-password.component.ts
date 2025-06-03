import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  mensagemSucesso: string = '';
  errors: string[] = [];

  passwordVisible: { [key: string]: boolean } = {
    password: false,
    confirmPassword: false,
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    this.token = queryParams.get('token');
    console.log(this.token);
  }

  goToResetPassword() {
    this.errors = [];

    if (!this.token) {
      this.errors.push('Token inválido ou expirado.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errors.push('As senhas não coincidem.');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      (response: any) => {
        this.mensagemSucesso =
          response?.message || 'Senha redefinida com sucesso!';
        this.confirmPassword = '';
        this.newPassword = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      (error) => {
        console.log(error);
        if (error.status === 400) {
          this.errors = ['E-mail não encontrado ou inválido.'];
        } else if (error.status === 500) {
          this.errors = ['Erro ao atualiza senha.'];
        } else {
          this.errors = ['Erro desconhecido na atualização de senha.'];
        }
      }
    );
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
}
