import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
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
  selector: 'app-grafico-linha',
  templateUrl: './grafico-linha.component.html',
  styleUrls: ['./grafico-linha.component.css'],
})
export class GraficoLinhaComponent implements OnInit, OnChanges, OnDestroy {
  @Input() series: ApexAxisChartSeries = [];
  @Input() categories: string[] = [];
  @Input() colors: string[] = [
    '#008FFB',
    '#00E396',
    '#FEB019',
    '#FF4560',
    '#775DD0',
  ];

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() responsive: boolean = true;
  @Input() animations: boolean = true;
  @Input() totalLabel: string = 'Total';
  @Input() showTotal: boolean = true;
  @Input() totalColor: string = '#333';

  chart!: ApexCharts;

  constructor() {}

  ngOnInit(): void {
    this.renderBarChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.chart &&
      (changes['series'] || changes['categories'] || changes['colors'])
    ) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  renderBarChart(): void {
    let subtitleText = this.subtitle;
    if (this.showTotal) {
      const total = this.totalValue;
      subtitleText = `${this.totalLabel}: ${total.toLocaleString()}`;
    }

    const options = {
      chart: {
        type: 'line',
        height: 350,
        width: '100%',
        animations: {
          enabled: this.animations,
          easing: 'easeinout',
          speed: 800,
        },
      },
      colors: this.colors,
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '45%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      title: {
        text: this.title,
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
        },
      },
      subtitle: {
        text: subtitleText,
        align: 'left',
        style: {
          fontSize: '12px',
          color: this.showTotal ? this.totalColor : '#666',
        },
      },
      series: this.series,
      xaxis: {
        categories: this.categories,
      },
      tooltip: {
        x: {
          formatter: (value: any, { dataPointIndex }: any) => {
            const mesesCompletos = {
              Jan: 'Janeiro',
              Fev: 'Fevereiro',
              Mar: 'Março',
              Abr: 'Abril',
              Mai: 'Maio',
              Jun: 'Junho',
              Jul: 'Julho',
              Ago: 'Agosto',
              Set: 'Setembro',
              Out: 'Outubro',
              Nov: 'Novembro',
              Dez: 'Dezembro',
            };

            const mesAbreviado = this.categories[dataPointIndex];
            return (
              mesesCompletos[mesAbreviado as keyof typeof mesesCompletos] ||
              mesAbreviado
            );
          },
        },
        y: {
          formatter: (value: number) => {
            return Math.floor(value).toString();
          },
        },
      },
      responsive: this.responsive
        ? [
            {
              breakpoint: 768,
              options: {
                chart: {
                  height: 250,
                },
                plotOptions: {
                  bar: {
                    columnWidth: '80%',
                  },
                },
              },
            },
            {
              breakpoint: 480,
              options: {
                chart: {
                  height: 200,
                },
                plotOptions: {
                  bar: {
                    columnWidth: '90%',
                  },
                },
              },
            },
          ]
        : [],
    };

    this.chart = new ApexCharts(this.chartContainer.nativeElement, options);
    this.chart.render();
  }

  private updateChart(): void {
    if (this.chart) {
      let subtitleText = this.subtitle;
      if (this.showTotal) {
        const total = this.totalValue;
        subtitleText = `${this.totalLabel}: ${total.toLocaleString()}`;
      }

      this.chart.updateOptions({
        series: this.series,
        xaxis: {
          categories: this.categories,
        },
        colors: this.colors,
        subtitle: {
          text: subtitleText,
          style: {
            fontSize: '14px',
            color: this.showTotal ? this.totalColor : '#666',
            fontWeight: this.showTotal ? '600' : 'normal',
          },
        },
      });
    }
  }

  public updateData(newSeries: any[], newCategories?: string[]): void {
    this.series = newSeries;
    if (newCategories) {
      this.categories = newCategories;
    }
    this.updateChart();
  }

  public exportChart(format: 'png' | 'svg' | 'csv' = 'png'): void {
    if (this.chart) {
      this.chart.dataURI().then((uri: any) => {
        const link = document.createElement('a');
        link.href = uri.imgURI;
        link.download = `grafico.${format}`;
        link.click();
      });
    }
  }

  get totalValue(): number {
    if (!this.series || this.series.length === 0) return 0;

    try {
      return this.series.reduce((total: number, serie: any) => {
        if (!Array.isArray(serie.data)) return total;

        const serieTotal = serie.data.reduce((sum: number, value: any) => {
          let numericValue = 0;

          if (typeof value === 'number' && !isNaN(value)) {
            numericValue = value;
          } else if (value && typeof value === 'object') {
            if (typeof value.y === 'number' && !isNaN(value.y)) {
              numericValue = value.y;
            } else if (typeof value.value === 'number' && !isNaN(value.value)) {
              numericValue = value.value;
            }
          }

          return sum + numericValue;
        }, 0);

        return total + serieTotal;
      }, 0);
    } catch (error) {
      console.warn('Erro ao calcular total do gráfico:', error);
      return 0;
    }
  }
}
