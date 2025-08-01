import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';
import { Empresa } from '../../empresas/empresa';
import { Setor } from '../../cadastro-de-colaborador/setor';
import { RegimeDaEmpresaDescricao } from '../../empresas/enums/regime-da-empresa-descricao';
import { ControleDeParcelamentoDescricao } from '../../empresas/enums/controle-de-parcelamento-descricao';
import { TipoEmpresaDescricao } from '../../empresas/enums/tipo-empresa-descricao';
import { SituacaoDescricao } from '../../empresas/enums/situacao-descricao';

@Component({
  selector: 'app-detalhes-empresa',
  templateUrl: './detalhes-empresa.component.html',
  styleUrls: ['./detalhes-empresa.component.css'],
})
export class DetalhesEmpresaComponent implements OnInit {
  empresa!: Empresa;

  colaboradores: Array<{
    id: string;
    nome: string;
    setor: Setor;
    username?: string;
    email?: string;
    fotoUrl: string;
  }> = [];

  paginaAtual = 1;
  itensPorPagina = 8;

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
          this.extrairColaboradores();
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

  getRegimeDescricao(regime?: string): string {
    if (!regime) return '-';

    const regimeKey = regime as keyof typeof RegimeDaEmpresaDescricao;
    return RegimeDaEmpresaDescricao[regimeKey] || regime;
  }

  getControleParcelamentoDescricaoArray(controle?: string[] | string): string {
    if (!controle) return '-';
    if (Array.isArray(controle)) {
      return controle
        .map(
          (c) =>
            ControleDeParcelamentoDescricao[
              c as keyof typeof ControleDeParcelamentoDescricao
            ] || c
        )
        .join(', ');
    }
    return (
      ControleDeParcelamentoDescricao[
        controle as keyof typeof ControleDeParcelamentoDescricao
      ] || controle
    );
  }

  getTipoEmpresaDescricao(tipo?: string): string {
    if (!tipo) return '-';

    const tipoKey = tipo as keyof typeof TipoEmpresaDescricao;
    return TipoEmpresaDescricao[tipoKey] || tipo;
  }

  getSituacaoDescricao(situacao?: string): string {
    if (!situacao) return '-';

    const situacaoKey = situacao as keyof typeof SituacaoDescricao;
    return SituacaoDescricao[situacaoKey] || situacao;
  }

  extrairColaboradores(): void {
    this.colaboradores = [];

    const adicionarColaboradores = (lista: any, setor: Setor) => {
      if (Array.isArray(lista)) {
        lista.forEach((colaborador) => {
          this.colaboradores.push({
            id: colaborador.id,
            nome: colaborador.nome,
            setor: setor,
            username: colaborador.nome,
            email: colaborador.email,
            fotoUrl: colaborador.fotoUrl || '',
          });
        });
      } else if (lista && typeof lista === 'object') {
        // Se vier como objeto único
        this.colaboradores.push({
          id: lista.id,
          nome: lista.nome,
          setor: setor,
          username: lista.nome,
          email: lista.email,
          fotoUrl: lista.fotoUrl || '',
        });
      }
    };

    adicionarColaboradores(this.empresa.contabil, Setor.CONTABIL);
    adicionarColaboradores(this.empresa.fiscal, Setor.FISCAL);
    adicionarColaboradores(this.empresa.financeiro, Setor.FINANCEIRO);
    adicionarColaboradores(this.empresa.paralegal, Setor.PARALEGAL);
    adicionarColaboradores(this.empresa.pessoal, Setor.PESSOAL);
  }

  get totalItens() {
    return this.colaboradores.length;
  }

  get colaboradoresPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.colaboradores.slice(inicio, fim);
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
  }
}
