import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './services/auth.guard';
import { PainelPrincipalComponent } from './sistema/painel-principal/painel-principal.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: LayoutComponent, children: [
    { path : 'usuario/painel-principal', component: PainelPrincipalComponent},
    { path: '', redirectTo: 'usuario/painel-principal', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
