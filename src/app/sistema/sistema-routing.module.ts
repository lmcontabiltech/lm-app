import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { PainelPrincipalComponent } from './painel-principal/painel-principal.component';
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

const routes: Routes = [
  {  path: 'usuario', 
    component: LayoutComponent,
    canActivate: [AuthGuard],  
    children: [
      { path: 'painel-principal', component: PainelPrincipalComponent},
      { path: 'meu-perfil', component:MeuPerfilComponent},
      { path: 'notificacoes', component: NotificacoesComponent},

      { path: 'colaboradores', component: ColaboradoresComponent},
      { path: 'empresas', component: EmpresasComponent},
      { path: 'perifericos', component:PerifericosComponent},
      { path: 'cadastro-de-perifericos', component: CadastroPerifericosComponent},
      { path: 'cadastro-de-perifericos/:id', component: CadastroPerifericosComponent},
      { path: 'cadastro-de-colaborador', component: CadastroDeColaboradorComponent},
      { path: 'cadastro-de-colaborador/:id', component: CadastroDeColaboradorComponent},
      { path: 'cadastro-de-empresa', component: CadastroDeEmpresaComponent},
      { path: 'cadastro-de-empresa/:id', component: CadastroDeEmpresaComponent},

      { path: 'atividades', component: AtividadesComponent},
      { path: 'chat', component: ChatComponent},
      { path: 'forum-de-noticias', component: ForumDeNoticiaComponent},
      { path: 'cadastro-de-atividade', component: CadastroDeAtividadeComponent},
      { path: 'cadastro-de-atividade/:id', component: CadastroDeAtividadeComponent},
      { path: 'cadastro-de-noticia', component: CadastroDeNoticiaComponent},
      { path: 'cadastro-de-noticia/:id', component: CadastroDeNoticiaComponent},
      { path: 'processos', component: ProcessosComponent},
      { path: 'cadastro-de-processos', component: CadastroDeProcessosComponent},
      { path: 'cadastro-de-processos/:id', component: CadastroDeProcessosComponent},
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
