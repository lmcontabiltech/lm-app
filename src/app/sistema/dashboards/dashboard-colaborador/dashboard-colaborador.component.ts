import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import {
  DashboardAdminService,
  GraficoSetor,
} from 'src/app/services/graficos/dashboard-admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-colaborador',
  templateUrl: './dashboard-colaborador.component.html',
  styleUrls: ['./dashboard-colaborador.component.css'],
})
export class DashboardColaboradorComponent implements OnInit {
  usuario: Usuario | null = null;
  cotacoes: any = {};
  selic: string = '';
  permissaoUsuario: string = '';

  setorUsuario = {
    nome: '',
    key: '',
    porcentagem: 0,
    icone: ''
  };

  private setoresMap: { [key: string]: { nome: string; key: string; icone: string } } = {
    CONTABIL: { nome: 'Contábil', key: 'contabil', icone: 'calculator.svg' },
    FISCAL: { nome: 'Fiscal', key: 'fiscal', icone: 'coin.svg' },
    PESSOAL: { nome: 'Pessoal', key: 'pessoal', icone: 'duo.svg' },
    PARALEGAL: { nome: 'Paralegal', key: 'paralegal', icone: 'balanca.svg' },
    FINANCEIRO: { nome: 'Financeiro', key: 'financeiro', icone: 'money.svg' },
  };

  constructor(
    private exchangeService: ExchangeService,
    private colaboradorService: ColaboradoresService,
    private dashboardAdminService: DashboardAdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTaxas();
    this.carregarPerfilUsuario();
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

  carregarPerfilUsuario(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario) => {
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

        if (usuario.setor && this.setoresMap[usuario.setor]) {
          this.setorUsuario = {
            nome: this.setoresMap[usuario.setor].nome,
            key: this.setoresMap[usuario.setor].key,
            icone: this.setoresMap[usuario.setor].icone,
            porcentagem: 0,
          };

          this.carregarProgressoSetor(usuario.setor);
        }
      },
      error: (error) => {
        console.error('Erro ao obter perfil do usuário:', error);
      },
    });
  }

  carregarProgressoSetor(setor: string): void {
    this.dashboardAdminService
      .getAtividadesConcluidasPorSetor(setor)
      .subscribe({
        next: (data: GraficoSetor) => {
          const porcentagem =
            data.total > 0
              ? Math.round((data.concluidas / data.total) * 100)
              : 0;
          this.setorUsuario.porcentagem = porcentagem;
        },
        error: () => {
          this.setorUsuario.porcentagem = 0;
        },
      });
  }
}
