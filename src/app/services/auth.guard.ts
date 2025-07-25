import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // 1. Verifica se está autenticado
    if (!this.authService.isAuthenticated()) {
      // Redireciona para login e salva a URL que tentou acessar
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // 2. Verifica a permissão (caso queira manter essa verificação também)
    const usuario = this.authService.getUsuarioAutenticado();
    const role = usuario?.permissao;

    if (
      role === 'ROLE_ADMIN' ||
      role === 'ROLE_COORDENADOR' ||
      role === 'ROLE_ESTAGIARIO' ||
      role === 'ROLE_USER'
    ) {
      return true;
    }

    // 3. Caso autenticado mas sem permissão
    this.router.navigate(['/forbidden']);
    return false;
  }
}
