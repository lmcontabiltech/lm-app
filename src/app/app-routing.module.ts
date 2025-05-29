import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { EsqueciSenhaComponent } from './recuperar-senha/esqueci-senha/esqueci-senha.component';
import { ResetPasswordComponent } from './recuperar-senha/reset-password/reset-password.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardAdminComponent } from './sistema/dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardColaboradorComponent } from './sistema/dashboards/dashboard-colaborador/dashboard-colaborador.component';
import { DashboardCoordenadorComponent } from './sistema/dashboards/dashboard-coordenador/dashboard-coordenador.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'recuperacao-de-senha', component: EsqueciSenhaComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard-admin',
        component: DashboardAdminComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard-coordenador',
        component: DashboardCoordenadorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard-colaborador',
        component: DashboardColaboradorComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
