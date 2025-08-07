import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import {
  DashboardAdminService,
  GraficoSetor,
} from 'src/app/services/graficos/dashboard-admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardColaboradorService } from 'src/app/services/graficos/dashboard-colaborador.service';
import { DashboardAtividadesPorSetorResponseDTO } from '../dashboard-admin/models/atividades-por-setor';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { GraficoAtividadesPorMes } from '../dashboard-admin/models/atividades-por-mes';

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
  nomeSetorGrafico: string = '';

  setorUsuario = {
    nome: '',
    key: '',
    porcentagem: 0,
    icone: '',
  };

  private setoresMap: {
    [key: string]: { nome: string; key: string; icone: string };
  } = {
    CONTABIL: { nome: 'Contábil', key: 'contabil', icone: 'calculator.svg' },
    FISCAL: { nome: 'Fiscal', key: 'fiscal', icone: 'coin.svg' },
    PESSOAL: { nome: 'Pessoal', key: 'pessoal', icone: 'duo.svg' },
    PARALEGAL: { nome: 'Paralegal', key: 'paralegal', icone: 'balanca.svg' },
    FINANCEIRO: { nome: 'Financeiro', key: 'financeiro', icone: 'money.svg' },
  };

  resumoAtividadesUsuario = {
    concluidas: 0,
    emAndamento: 0,
    totalAtribuidas: 0,
  };

  atividadesResumoSetor?: DashboardAtividadesPorSetorResponseDTO;

  atividadesPorMesSetor: { mes: string; quantidade: number }[] = [];
  totalAtividadesPorMes: number = 0;

  graficoAtividadesMensaisSetor = {
    series: [
      { name: 'Atividades', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
    categories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
  };

  constructor(
    private exchangeService: ExchangeService,
    private colaboradorService: ColaboradoresService,
    private dashboardAdminService: DashboardAdminService,
    private authService: AuthService,
    private dashboardColaboradorService: DashboardColaboradorService
  ) {}

  ngOnInit(): void {
    this.loadTaxas();
    this.carregarPerfilUsuario();
    this.carregarResumoAtividadesUsuario();
  }

  loadTaxas(): void {
    this.exchangeService.getExchangeRates().subscribe({
      next: (data) => {
        this.cotacoes = data;
      },
      error: (err) => console.error('Erro ao buscar taxas de câmbio:', err),
    });

    this.exchangeService.getSelicRate().subscribe({
      next: (valorSelic) => {
        this.selic = valorSelic.toFixed(2);
      },
      error: (err) => console.error('Erro ao buscar taxa Selic:', err),
    });
  }

  carregarPerfilUsuario(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario) => {
        this.usuario = usuario;

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

          this.nomeSetorGrafico = this.setoresMap[usuario.setor].nome;
          this.carregarProgressoSetor(usuario.setor);
          this.carregarResumoSetor(usuario.setor);
          this.carregarGraficoAtividadesPorMes(usuario.setor);
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

  carregarResumoAtividadesUsuario(): void {
    this.dashboardColaboradorService.getResumoAtividadesUsuario().subscribe({
      next: (resumo) => {
        this.resumoAtividadesUsuario = resumo;
      },
      error: (err) => {
        console.error('Erro ao buscar resumo das atividades do usuário:', err);
      },
    });
  }

  carregarResumoSetor(setor: Setor): void {
    const dataInicio = this.getDataInicioUltimos7Dias();
    this.dashboardColaboradorService
      .getAtividadesResumoSetor(setor, dataInicio)
      .subscribe({
        next: (resumo) => {
          this.atividadesResumoSetor = resumo;
        },
        error: (err) => {
          console.error('Erro ao buscar resumo de atividades do setor:', err);
        },
      });
  }

  // Função utilitária para pegar a data de 7 dias atrás
  getDataInicioUltimos7Dias(): string {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() - 7);
    return hoje.toISOString().split('T')[0];
  }

  carregarGraficoAtividadesPorMes(setor: Setor): void {
    this.dashboardColaboradorService.getAtividadesPorMesSetor(setor).subscribe({
      next: (data: GraficoAtividadesPorMes) => {
        console.log('Dados recebidos para atividades por mês:', data);
        this.atividadesPorMesSetor = data.valoresPorMes;
        this.totalAtividadesPorMes = data.total;
        this.atualizarGraficoAtividades();
      },
      error: (error) => {
        console.error('Erro ao carregar atividades por mês:', error);
        this.atividadesPorMesSetor = [];
        this.totalAtividadesPorMes = 0;
        this.graficoAtividadesMensaisSetor.series = [
          { name: 'Atividades', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        ];
      },
    });
  }

  atualizarGraficoAtividades(): void {
    const mesesOrdenados = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dadosGrafico: number[] = [];

    mesesOrdenados.forEach((mes) => {
      const mesEncontrado = this.atividadesPorMesSetor.find(
        (m) => m.mes === mes
      );
      dadosGrafico.push(
        mesEncontrado ? Math.floor(mesEncontrado.quantidade) : 0
      );
    });

    this.graficoAtividadesMensaisSetor.series = [
      {
        name: 'Atividades',
        data: dadosGrafico,
      },
    ];
  }
}
