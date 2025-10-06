import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  ScannerService,
  ScannerResponse,
} from 'src/app/services/gerenciamento/scanner.service';
import { ScannerRunResponseDTO } from '../../scanner/scanner';

@Component({
  selector: 'app-detalhes-scanner',
  templateUrl: './detalhes-scanner.component.html',
  styleUrls: ['./detalhes-scanner.component.css'],
})
export class DetalhesScannerComponent implements OnInit {
  scanner!: ScannerRunResponseDTO;

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
}
