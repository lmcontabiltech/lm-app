import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from './empresa';
import { EmpresasService } from '../../../services/empresas.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css'],
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.empresas.length / this.itensPorPagina);
  empresasPaginados: Empresa[] = [];

  constructor(
    private router: Router,
    private empresasService: EmpresasService
  ) {}

  ngOnInit(): void {
    this.fetchEmpresas();
    this.atualizarPaginacao();
  }

  cadastrarEmpresa(): void {
    this.router.navigate(['/usuario/cadastro-de-empresa']);
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  fetchEmpresas(): void {
    this.empresasService.getEmpresas().subscribe(
      (empresas: Empresa[]) => {
        this.empresas = empresas;
        this.totalPaginas = Math.ceil(
          this.empresas.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
      },
      (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    );
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.empresasPaginados = this.empresas.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  deletarEmpresa(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      this.empresasService.deletarEmpresa(id).subscribe(
        () => {
          this.empresas = this.empresas.filter((empresa) => empresa.id !== id);
          this.totalPaginas = Math.ceil(
            this.empresas.length / this.itensPorPagina
          );
          this.atualizarPaginacao();
          console.log('Empresa excluída com sucesso');
        },
        (error: any) => {
          console.error('Erro ao excluir empresa:', error);
        }
      );
    }
  }

  editarEmpresa(id: string): void {
    this.router.navigate(['/usuario/cadastro-de-empresa', id]);
  }
}
