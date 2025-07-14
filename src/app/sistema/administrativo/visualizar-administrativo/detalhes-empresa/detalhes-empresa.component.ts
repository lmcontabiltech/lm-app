import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';
import { Empresa } from '../../empresas/empresa';
import { Setor } from '../../cadastro-de-colaborador/setor';
import { RegimeDaEmpresaDescricao } from '../../empresas/enums/regime-da-empresa-descricao';

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

  extrairColaboradores(): void {
    this.colaboradores = [];

    if (this.empresa.contabil) {
      this.colaboradores.push({
        id: this.empresa.contabil.id,
        nome: this.empresa.contabil.nome,
        setor: Setor.CONTABIL,
        username: this.empresa.contabil.nome,
        email: this.empresa.contabil.email,
        fotoUrl: this.empresa.contabil.fotoUrl || '',
      });
    }

    if (this.empresa.fiscal) {
      this.colaboradores.push({
        id: this.empresa.fiscal.id,
        nome: this.empresa.fiscal.nome,
        setor: Setor.FISCAL,
        username: this.empresa.fiscal.nome,
        email: this.empresa.fiscal.email,
        fotoUrl: this.empresa.fiscal.fotoUrl || '',
      });
    }

    if (this.empresa.financeiro) {
      this.colaboradores.push({
        id: this.empresa.financeiro.id,
        nome: this.empresa.financeiro.nome,
        setor: Setor.FINANCEIRO,
        username: this.empresa.financeiro.nome,
        email: this.empresa.financeiro.email,
        fotoUrl: this.empresa.financeiro.fotoUrl || '',
      });
    }

    if (this.empresa.paralegal) {
      this.colaboradores.push({
        id: this.empresa.paralegal.id,
        nome: this.empresa.paralegal.nome,
        setor: Setor.PARALEGAL,
        username: this.empresa.paralegal.nome,
        email: this.empresa.paralegal.email,
        fotoUrl: this.empresa.paralegal.fotoUrl || '',
      });
    }

    if (this.empresa.pessoal) {
      this.colaboradores.push({
        id: this.empresa.pessoal.id,
        nome: this.empresa.pessoal.nome,
        setor: Setor.PESSOAL,
        username: this.empresa.pessoal.nome,
        email: this.empresa.pessoal.email,
        fotoUrl: this.empresa.pessoal.fotoUrl || '',
      });
    }
  }
}
