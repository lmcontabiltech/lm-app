import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SistemaRoutingModule } from './sistema-routing.module';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ProcessosComponent } from './gerenciamento/processos/processos.component';
import { CadastroDeProcessosComponent } from './gerenciamento/cadastro-de-processos/cadastro-de-processos.component';
import { PerifericosComponent } from './administrativo/perifericos/perifericos.component';
import { CadastroPerifericosComponent } from './administrativo/cadastro-perifericos/cadastro-perifericos.component';
import { DashboardAdminComponent } from './dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardColaboradorComponent } from './dashboards/dashboard-colaborador/dashboard-colaborador.component';
import { DashboardCoordenadorComponent } from './dashboards/dashboard-coordenador/dashboard-coordenador.component';
import { HistoricoAtividadesComponent } from './gerenciamento/historico-atividades/historico-atividades.component';
import { FluxosComponent } from './gerenciamento/fluxos/fluxos.component';
import { DetalhesFluxoComponent } from './gerenciamento/visualizar-gerenciamento/detalhes-fluxo/detalhes-fluxo.component';
import { VisualizarEmpresaComponent } from './administrativo/detalhes-administrativo/visualizar-empresa/visualizar-empresa.component';
import { VisualizarPerifericoComponent } from './administrativo/detalhes-administrativo/visualizar-periferico/visualizar-periferico.component';


@NgModule({
  declarations: [
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
    ProcessosComponent,
    CadastroDeProcessosComponent,
    PerifericosComponent,
    CadastroPerifericosComponent,
    DashboardAdminComponent,
    DashboardColaboradorComponent,
    DashboardCoordenadorComponent,
    HistoricoAtividadesComponent,
    FluxosComponent,
    DetalhesFluxoComponent,
    VisualizarEmpresaComponent,
    VisualizarPerifericoComponent,
  ],
  imports:[
    CommonModule, 
    SistemaRoutingModule, 
    FormsModule, 
    SharedModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    DragDropModule
  ],
})
export class SistemaModule {}
