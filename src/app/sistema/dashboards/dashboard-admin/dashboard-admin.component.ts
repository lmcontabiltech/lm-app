import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import * as ApexCharts from 'apexcharts';
import {
  GraficoFuncionariosPorSetor,
  FuncionarioPorSetor,
} from 'src/app/sistema/dashboards/dashboard-admin/funcionarios-por-setor';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
} from 'ng-apexcharts';
import {
  DashboardAdminService,
  GraficoSetor,
} from 'src/app/services/graficos/dashboard-admin.service';
import { forkJoin } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  usuario: Usuario | null = null;
  cotacoes: any = {};
  selic: string = '';
  permissaoUsuario: string = '';

  totalColaboradores: number = 0;
  totalEmpresas: number = 0;
  totalAtividadesNaoAtribuidas: number = 0;

  funcionariosPorSetor: FuncionarioPorSetor[] = [];
  totalFuncionarios: number = 0;
  graficoFuncionarios = {
    series: [{ name: 'Funcionários', data: [0, 0, 0, 0, 0] }],
    categories: ['Contábil', 'Fiscal', 'Financeiro', 'Paralegal', 'Pessoal'],
    colors: ['#08195D', '#1F337F', '#4a59a0', '#585A60', '#5a5f7b'],
  };

  progressoAtividades: {
    [key: string]: { porcentagem: number };
  } = {
    contabil: { porcentagem: 0 },
    fiscal: { porcentagem: 0 },
    pessoal: { porcentagem: 0 },
    paralegal: { porcentagem: 0 },
    financeiro: { porcentagem: 0 },
  };

  constructor(
    private exchangeService: ExchangeService,
    private colaboradorService: ColaboradoresService,
    private dashboardAdminService: DashboardAdminService
  ) {}

  ngOnInit(): void {
    this.loadTaxas();
    this.carregarProgressoSetores();
    this.carregarDadosGeral();
    this.carregarFuncionariosPorSetor();

    this.colaboradorService.getUsuarioByToken().subscribe(
      (usuario) => {
        this.usuario = usuario;
        console.log('Perfil do usuário:', usuario);

        // 🔹 Mapeamento da permissão
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

  carregarProgressoSetores() {
    const setores = [
      { key: 'contabil', nome: 'CONTABIL' },
      { key: 'fiscal', nome: 'FISCAL' },
      { key: 'pessoal', nome: 'PESSOAL' },
      { key: 'paralegal', nome: 'PARALEGAL' },
      { key: 'financeiro', nome: 'FINANCEIRO' },
    ];

    setores.forEach((setor) => {
      this.dashboardAdminService
        .getAtividadesConcluidasPorSetor(setor.nome)
        .subscribe({
          next: (data: GraficoSetor) => {
            const porcentagem =
              data.total > 0
                ? Math.round((data.concluidas / data.total) * 100)
                : 0;
            this.progressoAtividades[setor.key].porcentagem = porcentagem;
          },
          error: () => {
            this.progressoAtividades[setor.key].porcentagem = 0;
          },
        });
    });
  }

  carregarDadosGeral(): void {
    const requests = {
      colaboradores: this.dashboardAdminService.getQuantidadeUsuarios(),
      empresas: this.dashboardAdminService.getQuantidadeEmpresasNumero(),
      atividadesNaoAtribuidas:
        this.dashboardAdminService.getQuantidadeAtividadesNaoAtribuidas(),
    };

    forkJoin(requests).subscribe({
      next: (data) => {
        this.totalColaboradores = data.colaboradores.total;
        this.totalEmpresas = data.empresas.total;
        this.totalAtividadesNaoAtribuidas = data.atividadesNaoAtribuidas.total;

        console.log('Dados do dashboard carregados:', {
          colaboradores: this.totalColaboradores,
          empresas: this.totalEmpresas,
          atividadesNaoAtribuidas: this.totalAtividadesNaoAtribuidas,
        });
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        // Manter valores padrão em caso de erro
        this.totalColaboradores = 0;
        this.totalEmpresas = 0;
        this.totalAtividadesNaoAtribuidas = 0;
      },
    });
  }

  carregarFuncionariosPorSetor(): void {
    this.dashboardAdminService.getFuncionariosPorSetor().subscribe({
      next: (data: GraficoFuncionariosPorSetor) => {
        this.funcionariosPorSetor = data.setores;
         this.totalFuncionarios = Math.floor(data.total);

        this.atualizarGraficoFuncionarios();

        console.log('Funcionários por setor:', this.funcionariosPorSetor);
        console.log('Total de funcionários:', this.totalFuncionarios);
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários por setor:', error);
        this.funcionariosPorSetor = [];
        this.totalFuncionarios = 0;
        this.graficoFuncionarios.series = [
          { name: 'Funcionários', data: [0, 0, 0, 0, 0] },
        ];
      },
    });
  }

  atualizarGraficoFuncionarios(): void {
    const setoresOrdenados = [
      'CONTABIL',
      'FISCAL',
      'FINANCEIRO',
      'PARALEGAL',
      'PESSOAL',
    ];
    const dadosGrafico: number[] = [];

    setoresOrdenados.forEach((setor) => {
      const setorEncontrado = this.funcionariosPorSetor.find(
        (s) => s.setor === setor
      );
      dadosGrafico.push(
        setorEncontrado ? Math.floor(setorEncontrado.qtdFuncionarios) : 0
      );
    });

    this.graficoFuncionarios.series = [
      {
        name: 'Funcionários',
        data: dadosGrafico,
      },
    ];

    console.log(
      'Dados do gráfico atualizados:',
      this.graficoFuncionarios.series
    );
  }

  getFuncionariosPorSetorEspecifico(setor: string): number {
    const setorEncontrado = this.funcionariosPorSetor.find(
      (s) => s.setor === setor
    );
    return setorEncontrado ? Math.floor(setorEncontrado.qtdFuncionarios) : 0;
  }
}
