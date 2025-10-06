import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  ScannerService,
  ScannerResponse,
} from 'src/app/services/gerenciamento/scanner.service';
import { ScannerRunResponseDTO } from '../../scanner/scanner';

interface PlanilhaAnalise {
  nome: string;
  qtd: number;
  totalLinhas: number;
  linhasCorretas: number;
  percent: number;
  percentCorretas: number;
}

@Component({
  selector: 'app-detalhes-scanner',
  templateUrl: './detalhes-scanner.component.html',
  styleUrls: ['./detalhes-scanner.component.css'],
})
export class DetalhesScannerComponent implements OnInit {
  scanner!: ScannerRunResponseDTO;
  planilhasComErros: PlanilhaAnalise[] = [];
  resultadoScanner: ScannerResponse | null = null;
  graficoData: any = null;

  graficoErrosCorretos: { series: number[]; labels: string[] } = {
    series: [],
    labels: [],
  };

  totalErros: number = 0;
  totalItens: number = 0;
  totalCorrecoes: number = 0;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private scannerService: ScannerService
  ) {}

  ngOnInit(): void {
    this.carregarAnalise();
  }

  goBack() {
    this.location.back();
  }

  carregarAnalise(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.scannerService.buscarExecucaoScannerPorId(id).subscribe(
        (response) => {
          this.scanner = response;
          this.processarResultado();
          console.log('Dados da análise carregados:', this.scanner);
        },
        (error) => {
          console.error('Erro ao carregar os dados da análise:', error);
        }
      );
    }
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRandomColor(seed: string): string {
    const colors = [
      '#FFB3BA', // Rosa pastel
      '#FFDFBA', // Laranja pastel
      '#BAFFC9', // Verde pastel
      '#BAE1FF', // Azul pastel
      '#D5BAFF', // Roxo pastel
    ];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  processarResultado(): void {
    if (
      !this.scanner ||
      !this.scanner.errorsCounts ||
      !this.scanner.corrections
    ) {
      console.warn('Nenhum dado de análise encontrado.');
      return;
    }

    const errors = this.scanner.errorsCounts;
    const corrections = this.scanner.corrections;

    let totalErrosCorrigidos = 0;
    let totalLinhasProcessadas = 0;

    this.planilhasComErros = corrections.map((correction) => {
      const nome = correction.filename; // Nome da planilha
      const [errosCorrigidos, totalLinhas] = errors[nome] || [0, 0]; // Dados de erros e total de linhas

      totalErrosCorrigidos += errosCorrigidos;
      totalLinhasProcessadas += totalLinhas;

      const percentCorrigidos = totalLinhas
        ? Math.round((errosCorrigidos / totalLinhas) * 100)
        : 0;

      const linhasCorretas = totalLinhas - errosCorrigidos;
      const percentCorretas = totalLinhas
        ? Math.round((linhasCorretas / totalLinhas) * 100)
        : 0;

      return {
        nome,
        qtd: errosCorrigidos,
        totalLinhas,
        linhasCorretas,
        percent: percentCorrigidos,
        percentCorretas,
      };
    });

    // Total de erros corrigidos e total de itens processados
    this.totalErros = totalErrosCorrigidos;
    this.totalItens = totalLinhasProcessadas;

    // Total de correções é igual ao total de erros corrigidos
    this.totalCorrecoes = totalErrosCorrigidos;

    this.graficoErrosCorretos = {
      series: [
        totalErrosCorrigidos,
        totalLinhasProcessadas - totalErrosCorrigidos,
      ],
      labels: ['Linhas corrigidas', 'Linhas corretas'],
    };

    console.log(
      'Dados processados:',
      this.planilhasComErros,
      this.graficoErrosCorretos
    );
  }

  baixarZip(): void {
    if (!this.scanner?.id) return;
    this.scannerService.baixarCorrecaoZip(this.scanner.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'correcoes.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  baixarPdf(): void {
    if (!this.scanner?.id) return;
    this.scannerService
      .baixarRelatorioScanner(this.scanner.id)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analise.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  getTotalErros(errorsCounts: { [key: string]: number } | undefined): number {
    if (!errorsCounts) return 0;
    return Object.values(errorsCounts).reduce(
      (total, count) => total + count,
      0
    );
  }
}
