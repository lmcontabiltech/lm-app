import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
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
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

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
     this.renderChart();
     this.renderBarChart();
     this.renderPieChart();
     this.loadTaxas();
 
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
 
   renderChart(): void {
     const options = {
       chart: {
         type: 'line',
         height: 350,
         width: '100%',
       },
       series: [
         {
           name: 'Desempenho',
           data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 15, 200, 20],
         },
       ],
       xaxis: {
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
           'out',
           'nov',
           'dez',
         ],
       },
       theme: {
         palette: 'palette3',
       },
     };
 
     const chart = new ApexCharts(document.querySelector('#chart'), options);
     chart.render();
   }
 
   renderBarChart(): void {
     const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];
     const options = {
       chart: {
         type: 'bar',
         height: 350,
         width: '100%',
         events: {
           click: function (chart: any, w: any, e: any) {},
         },
       },
       colors: colors,
       plotOptions: {
         bar: {
           columnWidth: '45%',
           distributed: true,
         },
       },
       dataLabels: {
         enabled: false,
       },
       legend: {
         show: false,
       },
       series: [
         {
           name: 'Funcionários',
           data: [20, 30, 40, 50, 60],
         },
       ],
       xaxis: {
         categories: [
           'Setor Contábil',
           'Setor Pessoal',
           'Setor Fiscal',
           'Setor Paralegal',
           'Setor Financeiro',
         ],
       },
       labels: {
         style: {
           colors: colors,
           fontSize: '12px',
         },
       },
     };
 
     const chart = new ApexCharts(document.querySelector('#barChart'), options);
     chart.render();
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
 