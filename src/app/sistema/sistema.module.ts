import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PainelPrincipalComponent } from './painel-principal/painel-principal.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { FormsModule } from '@angular/forms';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { EmpresasComponent } from './administrativo/empresas/empresas.component';
import { ColaboradoresComponent } from './administrativo/colaboradores/colaboradores.component';
import { ChatComponent } from './gerenciamento/chat/chat.component';
import { AtividadesComponent } from './gerenciamento/atividades/atividades.component';
import { CadastroDeColaboradorComponent } from './administrativo/cadastro-de-colaborador/cadastro-de-colaborador.component';
import { CadastroDeEmpresaComponent } from './administrativo/cadastro-de-empresa/cadastro-de-empresa.component';
import { CadastroDeNoticiaComponent } from './gerenciamento/cadastro-de-noticia/cadastro-de-noticia.component';
import { CadastroDeAtividadeComponent } from './gerenciamento/cadastro-de-atividade/cadastro-de-atividade.component';
import { SharedModule } from '../shared/shared.module';
import { ForumDeNoticiaComponent } from './gerenciamento/forum-de-noticia/forum-de-noticia.component';

@NgModule({
  declarations: [
    PainelPrincipalComponent,
    MeuPerfilComponent,
    NotificacoesComponent,
    EmpresasComponent,
    ColaboradoresComponent,
    ForumDeNoticiaComponent,
    ChatComponent,
    AtividadesComponent,
    CadastroDeColaboradorComponent,
    CadastroDeEmpresaComponent,
    CadastroDeNoticiaComponent,
    CadastroDeAtividadeComponent,
    ForumDeNoticiaComponent,
  ],
  imports:
  [
    CommonModule, 
    SistemaRoutingModule, 
    FormsModule, 
    SharedModule
  ],
})
export class SistemaModule {}
