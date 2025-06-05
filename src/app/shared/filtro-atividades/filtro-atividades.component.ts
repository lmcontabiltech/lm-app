import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor-descricao';

@Component({
  selector: 'app-filtro-atividades',
  templateUrl: './filtro-atividades.component.html',
  styleUrls: ['./filtro-atividades.component.css'],
})
export class FiltroAtividadesComponent implements OnInit {
  @Input() menuAberto = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() filtroAplicado = new EventEmitter<any>();

  filtro: { [key: string]: boolean | string } = {
    semMembros: false,
    atribuidoAMim: false,
    todosSetores: false,
    marcado: false,
    naoMarcado: false,
    periodo: '', 
  };

  setores: string[] = [];

  constructor() {}

  ngOnInit(): void {
    // Se SetorDescricao for um enum de string:
    this.setores = Object.values(SetorDescricao);

    // Inicializa os filtros dos setores dinamicamente
    this.setores.forEach((setor) => {
      this.filtro['setor_' + setor] = false;
    });
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  filtrosAtivos(): boolean {
    return Object.values(this.filtro).some((v) => v);
  }

  contarFiltros(): number {
    return Object.values(this.filtro).filter((v) => v).length;
  }

  limparFiltro() {
    Object.keys(this.filtro).forEach((k) => (this.filtro[k] = false));
  }
}
