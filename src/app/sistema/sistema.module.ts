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
import { DetalhesEmpresaComponent } from './administrativo/visualizar-administrativo/detalhes-empresa/detalhes-empresa.component';
import { HistoricoUsuariosInativosComponent } from './administrativo/visualizar-administrativo/historico-usuarios-inativos/historico-usuarios-inativos.component';
import { HistoricoEmpresasInativasComponent } from './administrativo/visualizar-administrativo/historico-empresas-inativas/historico-empresas-inativas.component';
import { DetalhesPerifericoComponent } from './administrativo/visualizar-administrativo/detalhes-periferico/detalhes-periferico.component';
import { DetalhesFilialEmpresaComponent } from './administrativo/visualizar-administrativo/detalhes-filial-empresa/detalhes-filial-empresa.component';
import { FilialEmpresaComponent } from './administrativo/filial-empresa/filial-empresa.component';
import { CadastroFilialEmpresaComponent } from './administrativo/cadastro-filial-empresa/cadastro-filial-empresa.component';
import { CentralDeNoticiasComponent } from './gerenciamento/central-de-noticias/central-de-noticias.component';
import { DetalhesNoticiaComponent } from './gerenciamento/visualizar-gerenciamento/detalhes-noticia/detalhes-noticia.component';


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
    DetalhesEmpresaComponent,
    HistoricoUsuariosInativosComponent,
    HistoricoEmpresasInativasComponent,
    DetalhesPerifericoComponent,
    DetalhesFilialEmpresaComponent,
    FilialEmpresaComponent,
    CadastroFilialEmpresaComponent,
    CentralDeNoticiasComponent,
    DetalhesNoticiaComponent,
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
