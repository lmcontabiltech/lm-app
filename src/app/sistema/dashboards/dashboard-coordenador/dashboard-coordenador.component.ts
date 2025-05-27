import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { ExchangeService } from 'src/app/services/exchange.service';

@Component({
  selector: 'app-dashboard-coordenador',
  templateUrl: './dashboard-coordenador.component.html',
  styleUrls: ['./dashboard-coordenador.component.css']
})
export class DashboardCoordenadorComponent implements OnInit {

 usuario: Usuario | null = null;
    cotacoes: any = {};
    selic: string = '';
    permissaoUsuario: string = '';
   
    progressoAtividades = {
       contabil: { porcentagem: 75 },
       fiscal: { porcentagem: 60 },
       pessoal: { porcentagem: 50 },
       paralegal: { porcentagem: 40 },
       financeiro: { porcentagem: 30 },
    };
   
     constructor(
       private exchangeService: ExchangeService,
       private colaboradorService: ColaboradoresService
     ) {}
   
     ngOnInit(): void {
       this.loadTaxas();
   
       this.colaboradorService.getUsuarioByToken().subscribe(
         (usuario) => {
           this.usuario = usuario;
           console.log('Perfil do usuário:', usuario);
   
           switch (usuario.permissao) {
             case 'ROLE_ADMIN':
               this.permissaoUsuario = 'Administrador';
               break;
             case 'ROLE_COORDENADOR':
               this.permissaoUsuario = 'Coordenador';
               break;
             case 'ROLE_USER':
               this.permissaoUsuario = 'Colaborador';
               break;
             default:
               this.permissaoUsuario = 'Desconhecido';
           }
         },
         (error) => {
           console.error('Erro ao obter perfil do usuário:', error);
         }
       );
     }
   
     loadTaxas(): void {
      this.exchangeService.getExchangeRates().subscribe({
        next: (data) => {
          this.cotacoes = data;
          console.log('Cotações armazenadas:', this.cotacoes);
        },
        error: (err) => console.error('Erro ao buscar taxas de câmbio:', err),
      });
    
      this.exchangeService.getSelicRate().subscribe({
        next: (valorSelic) => {
          this.selic = valorSelic.toFixed(2); 
          console.log('Taxa Selic:', this.selic);
        },
        error: (err) => console.error('Erro ao buscar taxa Selic:', err),
      });
    }
}