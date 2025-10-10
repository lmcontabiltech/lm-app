import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Colaborador } from 'src/app/sistema/administrativo/colaboradores/colaborador';

@Component({
  selector: 'app-input-participantes',
  templateUrl: './input-participantes.component.html',
  styleUrls: ['./input-participantes.component.css'],
})
export class InputParticipantesComponent implements OnInit {
  @Input() colaboradores: Colaborador[] = [];
  @Input() participantes: Colaborador[] = [];
  @Output() participantesChange = new EventEmitter<Colaborador[]>();

  searchText: string = '';
  filteredColaboradores: Colaborador[] = [];
  dropdownOpen: boolean = false;
  highlightedIndex: number = -1; // Índice da opção atualmente destacada

  constructor() {}

  ngOnInit(): void {
    this.filteredColaboradores = [...this.colaboradores];
  }

  onInputFocus(): void {
    this.dropdownOpen = true;
    this.filterColaboradores();
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 200);
  }

  filterColaboradores(): void {
    const search = this.searchText.toLowerCase();
    this.filteredColaboradores = this.colaboradores.filter(
      (colaborador) =>
        !this.participantes.find((p: Colaborador) => p.id === colaborador.id) &&
        colaborador.nome.toLowerCase().includes(search)
    );

    // Reinicia o índice destacado
    this.highlightedIndex = this.filteredColaboradores.length > 0 ? 0 : -1;
  }

  addParticipante(colaborador: Colaborador): void {
    console.log('Colaborador selecionado:', colaborador); // Log para verificar o colaborador selecionado

    if (!this.participantes.find((p: Colaborador) => p.id === colaborador.id)) {
      this.participantes.push(colaborador);
      this.participantesChange.emit(this.participantes);
    }

    this.searchText = '';
    this.filterColaboradores();
  }

  removeParticipante(colaborador: Colaborador): void {
    this.participantes = this.participantes.filter(
      (p: Colaborador) => p.id !== colaborador.id
    );
    this.participantesChange.emit(this.participantes);
    this.filterColaboradores();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      // Move o destaque para baixo
      this.highlightedIndex =
        (this.highlightedIndex + 1) % this.filteredColaboradores.length;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      // Move o destaque para cima
      this.highlightedIndex =
        (this.highlightedIndex - 1 + this.filteredColaboradores.length) %
        this.filteredColaboradores.length;
      event.preventDefault();
    } else if (event.key === 'Enter' && this.highlightedIndex >= 0) {
      // Adiciona o colaborador destacado
      this.addParticipante(this.filteredColaboradores[this.highlightedIndex]);
      event.preventDefault();
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
