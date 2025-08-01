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
  selector: 'app-grafico-rosquinha',
  templateUrl: './grafico-rosquinha.component.html',
  styleUrls: ['./grafico-rosquinha.component.css'],
})
export class GraficoRosquinhaComponent implements OnInit, OnChanges, OnDestroy {
  @Input() series: number[] = [];
  @Input() categories: string[] = [];
  @Input() labels: string[] = [];
  @Input() colors: string[] = [
    '#008FFB', // azul
    '#00E396', // verde
    '#FEB019', // amarelo
    '#FF4560', // vermelho
    '#775DD0', // roxo
    
    '#3F51B5', // azul indigo
    '#546E7A', // cinza azulado
    '#26A69A', // teal
    '#D10CE8', // magenta
    '#F9CE1D', // amarelo claro

    '#FF6B6B', // vermelho coral
    '#1ABC9C', // verde água
    '#9C27B0', // roxo escuro
    '#F39C12', // laranja forte
    '#E74C3C', // vermelho vivo

    '#2ECC71', // verde vivo
    '#2980B9', // azul escuro
    '#8E44AD', // roxo vibrante
    '#34495E', // azul petróleo
    '#95A5A6', // cinza claro
  ];
  @Input() colorPalette: string = 'palette1';

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() responsive: boolean = true;
  @Input() animations: boolean = true;
  @Input() showLegend: boolean = true;
  @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() donutSize: string = '65%';
  @Input() height: number = 380;

  chart!: ApexCharts;

  constructor() {}

  ngOnInit(): void {
    this.renderDonutChart();
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

  renderDonutChart(): void {
    const options = {
      chart: {
        type: 'donut',
        height: this.height,
        width: '100%',
        animations: {
          enabled: this.animations,
          easing: 'easeinout',
          speed: 800,
        },
      },
      series: this.series,
      labels: this.labels,
      ...(this.colors.length > 0
        ? { colors: this.colors }
        : {
            theme: {
              palette: this.colorPalette,
            },
          }),
      colors: this.colors,
      plotOptions: {
        pie: {
          donut: {
            size: this.donutSize,
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontWeight: 600,
                color: '#333',
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 400,
                color: '#333',
                formatter: (val: string) => {
                  return val;
                },
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '14px',
                fontWeight: 600,
                color: '#373d3f',
                formatter: (w: any) => {
                  const total = w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                  );
                  return total.toString();
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
        formatter: (val: number) => {
          return Math.round(val) + '%';
        },
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      legend: {
        show: this.showLegend,
        position: this.legendPosition,
        horizontalAlign: 'center',
        fontSize: '12px',
        markers: {
          width: 12,
          height: 12,
          radius: 2,
        },
        itemMargin: {
          horizontal: 5,
          vertical: 5,
        },
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
        text: this.subtitle,
        align: 'center',
        style: {
          fontSize: '12px',
          color: '#666',
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => {
            return val + ' empresas';
          },
        },
      },
      responsive: this.responsive
        ? [
            {
              breakpoint: 768,
              options: {
                chart: {
                  height: 300,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
            {
              breakpoint: 480,
              options: {
                chart: {
                  height: 250,
                },
                legend: {
                  position: 'bottom',
                  fontSize: '10px',
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        name: {
                          fontSize: '12px',
                        },
                        value: {
                          fontSize: '14px',
                        },
                      },
                    },
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
      const updateOptions: any = {
        series: this.series,
        labels: this.labels,
      };

      if (this.colors.length > 0) {
        updateOptions.colors = this.colors;
      } else {
        updateOptions.theme = {
          palette: this.colorPalette,
        };
      }

      this.chart.updateOptions(updateOptions);
    }
  }

  public updateData(newSeries: number[], newLabels?: string[]): void {
    this.series = newSeries;
    if (newLabels) {
      this.labels = newLabels;
    }
    this.updateChart();
  }

  public exportChart(format: 'png' | 'svg' | 'csv' = 'png'): void {
    if (this.chart) {
      this.chart.dataURI().then((uri: any) => {
        const link = document.createElement('a');
        link.href = uri.imgURI;
        link.download = `grafico-rosquinha.${format}`;
        link.click();
      });
    }
  }

  get totalValue(): number {
    return this.series.reduce((sum: number, value: number) => sum + value, 0);
  }
}
