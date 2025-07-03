import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import * as ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { DashboardAdminService, GraficoSetor } from 'src/app/services/graficos/dashboard-admin.service';

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
    this.renderPieChart();
    this.loadTaxas();
    this.carregarProgressoSetores();

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

  renderPieChart(): void {
    const options = {
      chart: {
        type: 'donut',
        height: 350,
        width: '100%',
      },
      series: [44, 55, 13],
      labels: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
      theme: {
        palette: 'palette2',
      },
      responsive: [
        {
          breakpoint: 980,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector('#pieChart'), options);
    chart.render();
  }
}
