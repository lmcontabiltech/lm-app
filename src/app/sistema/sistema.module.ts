import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PainelPrincipalComponent } from './painel-principal/painel-principal.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PainelPrincipalComponent,
    MeuPerfilComponent
  ],
  imports: [
    CommonModule,
    SistemaRoutingModule,
    FormsModule
  ]
})
export class SistemaModule { }
