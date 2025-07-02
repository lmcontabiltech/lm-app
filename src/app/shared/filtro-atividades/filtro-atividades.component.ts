import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Setor } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from 'src/app/sistema/administrativo/cadastro-de-colaborador/setor-descricao';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';
import { AutoCompleteOption } from 'src/app/shared/select-auto-complete/select-auto-complete.component';

@Component({
  selector: 'app-filtro-atividades',
  templateUrl: './filtro-atividades.component.html',
  styleUrls: ['./filtro-atividades.component.css'],
})
export class FiltroAtividadesComponent implements OnInit {
  @Input() menuAberto = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() filtroAplicado = new EventEmitter<any>();

  filtro: { [key: string]: boolean | string | string[] } = {
    semMembros: false,
    atribuidoAMim: false,
    marcado: false,
    naoMarcado: false,
    periodo: '',
    setoresSelecionados: [],
  };

  SetorDescricao = SetorDescricao;
  setores: string[] = [];

  empresasOptions: AutoCompleteOption[] = [];
  empresasSelecionadas: string[] = [];

  constructor(private empresasService: EmpresasService) {}

  ngOnInit(): void {
    this.setores = Object.keys(SetorDescricao);
    this.carregarEmpresas();
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  filtrosAtivos(): boolean {
    return Object.values(this.filtro).some((v) => v);
  }

  contarFiltros(): number {
    let count = 0;
    if (this.filtro['semMembros']) count++;
    if (this.filtro['atribuidoAMim']) count++;
    if (this.filtro['marcado']) count++;
    if (this.filtro['naoMarcado']) count++;
    if (this.filtro['periodo'] && this.filtro['periodo'] !== '') count++;
    if (Array.isArray(this.filtro['setoresSelecionados'])) {
      count += this.filtro['setoresSelecionados'].length;
    }
    return count;
  }

  limparFiltro() {
    this.filtro['semMembros'] = false;
    this.filtro['atribuidoAMim'] = false;
    this.filtro['marcado'] = false;
    this.filtro['naoMarcado'] = false;
    this.filtro['periodo'] = '';
    this.filtro['setoresSelecionados'] = [];
    this.emitirFiltro();
  }

  emitirFiltro() {
    console.log('Emitindo filtro:', this.filtro);
    const filtroParaEmitir = {
      semMembros: this.filtro['semMembros'],
      atribuidoAMim: this.filtro['atribuidoAMim'],
      marcado: this.filtro['marcado'],
      naoMarcado: this.filtro['naoMarcado'],
      periodo: this.filtro['periodo'],
      setores: this.filtro['setoresSelecionados'],
    };
    this.filtroAplicado.emit(filtroParaEmitir);
  }

  onSetorCheckboxChange(event: Event, value: string) {
    const checked = (event.target as HTMLInputElement).checked;
    let setores = this.filtro['setoresSelecionados'] as string[];
    if (!Array.isArray(setores)) setores = [];
    if (checked) {
      if (!setores.includes(value)) setores.push(value);
    } else {
      setores = setores.filter((v) => v !== value);
    }
    this.filtro['setoresSelecionados'] = setores;
    this.emitirFiltro();
  }

  isSetorSelecionado(value: string): boolean {
    return (
      Array.isArray(this.filtro['setoresSelecionados']) &&
      this.filtro['setoresSelecionados'].includes(value)
    );
  }

  getSetorDescricao(setor: string): string {
    return this.SetorDescricao[setor as Setor] ?? setor;
  }

  carregarEmpresas(): void {
    this.empresasService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresasOptions = empresas.map((empresa) => ({
          value: empresa.id.toString(),
          description: empresa.razaoSocial,
        }));
        console.log('Empresas carregadas para o select:', this.empresasOptions);
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
      },
    });
  }

  onEmpresaSelecionada(empresas: string[]): void {
    this.empresasSelecionadas = empresas;
    console.log('Empresas selecionadas:', empresas);

    if (empresas && empresas.length > 0) {
      const idsEmpresas = empresas.map((id) => Number(id));
    }
  }
}
