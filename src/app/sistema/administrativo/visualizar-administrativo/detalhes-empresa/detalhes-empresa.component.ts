import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';
import { Empresa } from '../../empresas/empresa';

@Component({
  selector: 'app-detalhes-empresa',
  templateUrl: './detalhes-empresa.component.html',
  styleUrls: ['./detalhes-empresa.component.css'],
})
export class DetalhesEmpresaComponent implements OnInit {
  empresa!: Empresa;

  colaboradores: any[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.colaboradores.length / this.itensPorPagina);
  colaboradoresPaginados: any[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private empresasService: EmpresasService
  ) {}

  ngOnInit(): void {
    this.carregarEmpresa();
  }

  goBack() {
    this.location.back();
  }

  carregarEmpresa(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.empresasService.getEmpresaById(id).subscribe(
        (response) => {
          this.empresa = response;
          console.log('Dados da empresa carregados:', this.empresa);
        },
        (error) => {
          console.error('Erro ao carregar os dados da empresa:', error);
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
