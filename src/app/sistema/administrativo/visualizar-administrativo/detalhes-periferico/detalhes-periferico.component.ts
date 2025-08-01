import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PerifericoService } from 'src/app/services/administrativo/periferico.service';
import { Periferico } from '../../perifericos/periferico';
import { Setor } from '../../cadastro-de-colaborador/setor';

@Component({
  selector: 'app-detalhes-periferico',
  templateUrl: './detalhes-periferico.component.html',
  styleUrls: ['./detalhes-periferico.component.css'],
})
export class DetalhesPerifericoComponent implements OnInit {
  periferico!: Periferico;

  tipoPosseDescricaoMap: Record<string, string> = {
    PROPRIO_EMPRESA: 'O periférico pertence à empresa.',
    ALUGADO: 'O periférico é alugado.',
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private perifericoService: PerifericoService
  ) {}

  ngOnInit(): void {
    this.carregarPeriferico();
  }

  goBack() {
    this.location.back();
  }

  carregarPeriferico(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.perifericoService.getPerifericoById(id).subscribe(
        (response) => {
          this.periferico = response;
          console.log('Dados do periférico carregados:', this.periferico);
        },
        (error) => {
          console.error('Erro ao carregar os dados do periférico:', error);
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

  getTipoPosseDescricao(tipo: string): string {
    return this.tipoPosseDescricaoMap[tipo] || '';
  }
}
