import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { PainelPrincipalComponent } from './painel-principal/painel-principal.component';

const routes: Routes = [
  { path: 'usuario', 
    component: LayoutComponent,  
    children: [
      { path: 'painel-principal', component: PainelPrincipalComponent},
      { path: 'meu-perfil', component:MeuPerfilComponent},
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
