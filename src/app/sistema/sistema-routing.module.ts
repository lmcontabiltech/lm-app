import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { ColaboradoresComponent } from './administrativo/colaboradores/colaboradores.component';
import { EmpresasComponent } from './administrativo/empresas/empresas.component';
import { CadastroDeColaboradorComponent } from './administrativo/cadastro-de-colaborador/cadastro-de-colaborador.component';
import { CadastroDeEmpresaComponent } from './administrativo/cadastro-de-empresa/cadastro-de-empresa.component';
import { AtividadesComponent } from './gerenciamento/atividades/atividades.component';
import { ChatComponent } from './gerenciamento/chat/chat.component';
import { ForumDeNoticiaComponent } from './gerenciamento/forum-de-noticia/forum-de-noticia.component';
import { CadastroDeAtividadeComponent } from './gerenciamento/cadastro-de-atividade/cadastro-de-atividade.component';
import { CadastroDeNoticiaComponent } from './gerenciamento/cadastro-de-noticia/cadastro-de-noticia.component';
import { ProcessosComponent } from './gerenciamento/processos/processos.component';
import { CadastroDeProcessosComponent } from './gerenciamento/cadastro-de-processos/cadastro-de-processos.component';
import { AuthGuard } from '../services/auth.guard';
import { PerifericosComponent } from './administrativo/perifericos/perifericos.component';
import { CadastroPerifericosComponent } from './administrativo/cadastro-perifericos/cadastro-perifericos.component';
import { DashboardAdminComponent } from './dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardColaboradorComponent } from './dashboards/dashboard-colaborador/dashboard-colaborador.component';
import { DashboardCoordenadorComponent } from './dashboards/dashboard-coordenador/dashboard-coordenador.component';
import { FluxosComponent } from './gerenciamento/fluxos/fluxos.component';
import { DetalhesFluxoComponent } from './gerenciamento/visualizar-gerenciamento/detalhes-fluxo/detalhes-fluxo.component';
import { HistoricoAtividadesComponent } from './gerenciamento/historico-atividades/historico-atividades.component';
import { DetalhesEmpresaComponent } from './administrativo/visualizar-administrativo/detalhes-empresa/detalhes-empresa.component';
import { HistoricoUsuariosInativosComponent } from './administrativo/visualizar-administrativo/historico-usuarios-inativos/historico-usuarios-inativos.component';
import { HistoricoEmpresasInativasComponent } from './administrativo/visualizar-administrativo/historico-empresas-inativas/historico-empresas-inativas.component';
import { DetalhesPerifericoComponent } from './administrativo/visualizar-administrativo/detalhes-periferico/detalhes-periferico.component';
import { CadastroFilialEmpresaComponent } from './administrativo/cadastro-filial-empresa/cadastro-filial-empresa.component';
import { FilialEmpresaComponent } from './administrativo/filial-empresa/filial-empresa.component';
import { DetalhesFilialEmpresaComponent } from './administrativo/visualizar-administrativo/detalhes-filial-empresa/detalhes-filial-empresa.component';
import { CentralDeNoticiasComponent } from './gerenciamento/central-de-noticias/central-de-noticias.component';
import { DetalhesNoticiaComponent } from './gerenciamento/visualizar-gerenciamento/detalhes-noticia/detalhes-noticia.component';

const routes: Routes = [
  {  path: 'usuario', 
    component: LayoutComponent,
    canActivate: [AuthGuard],  
    children: [
      
    { path: 'meu-perfil', component:MeuPerfilComponent},
    { path: 'notificacoes', component: NotificacoesComponent},

    {path:'dashboard-admin', component: DashboardAdminComponent}, // admin
    {path:'dashboard-colaborador', component: DashboardColaboradorComponent}, //colaborador
    {path:'dashboard-coordenador', component: DashboardCoordenadorComponent}, //coordenador

      // apenas admin e coordenador
      { path: 'colaboradores', component: ColaboradoresComponent},
      { path: 'empresas', component: EmpresasComponent},
      { path: 'perifericos', component:PerifericosComponent},
      { path: 'cadastro-de-perifericos', component: CadastroPerifericosComponent},
      { path: 'cadastro-de-perifericos/:id', component: CadastroPerifericosComponent},
      { path: 'detalhes-periferico/:id', component: DetalhesPerifericoComponent},
      { path: 'cadastro-de-colaborador', component: CadastroDeColaboradorComponent},
      { path: 'cadastro-de-colaborador/:id', component: CadastroDeColaboradorComponent},
      { path: 'cadastro-de-empresa', component: CadastroDeEmpresaComponent},
      { path: 'cadastro-de-empresa/:id', component: CadastroDeEmpresaComponent},
      { path: 'detalhes-empresa/:id', component: DetalhesEmpresaComponent},
      { path: 'historico-usuarios-inativos', component: HistoricoUsuariosInativosComponent},
      { path: 'historico-empresas-inativas', component: HistoricoEmpresasInativasComponent},
      { path: 'cadastro-filial-empresa', component: CadastroFilialEmpresaComponent},
      { path: 'filial-empresa', component: FilialEmpresaComponent},
      { path: 'detalhes-filial-empresa/:id', component: DetalhesFilialEmpresaComponent},

      { path: 'atividades', component: AtividadesComponent},
      { path: 'chat', component: ChatComponent},
      { path: 'forum-de-noticias', component: ForumDeNoticiaComponent},
      { path: 'cadastro-de-atividade', component: CadastroDeAtividadeComponent},
      { path: 'cadastro-de-atividade/:id', component: CadastroDeAtividadeComponent},
      { path: 'historico-atividades', component: HistoricoAtividadesComponent},
      { path: 'cadastro-de-noticia', component: CadastroDeNoticiaComponent},
      { path: 'cadastro-de-noticia/:id', component: CadastroDeNoticiaComponent},
      { path: 'central-de-noticias', component: CentralDeNoticiasComponent},
      { path: 'detalhes-noticia/:id', component: DetalhesNoticiaComponent},
      { path: 'processos', component: ProcessosComponent},
      { path: 'cadastro-de-processos', component: CadastroDeProcessosComponent},
      { path: 'cadastro-de-processos/:id', component: CadastroDeProcessosComponent},
      { path: 'fluxos', component: FluxosComponent},
      { path: 'detalhes-fluxo/:id', component: DetalhesFluxoComponent},	
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
