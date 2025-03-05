import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from './empresa';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' },
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' },
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' },
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' },
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' },
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' },
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' },
    { razaoSocial: 'J. Erivaldo e Cia LTDA', cnpj: '06.001.044/0001-12', codQuestor: '000000', regimeEmpresa: 'Lucro Real' }
  ];

  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = Math.ceil(this.empresas.length / this.itensPorPagina);
  empresasPaginados: Empresa[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.atualizarPaginacao();
  }

  cadastrarEmpresa(): void {
    this.router.navigate(['/usuario/cadastro-de-empresa']); 
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
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

}
