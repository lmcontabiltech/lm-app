import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from './empresa';
import { EmpresasService } from '../../../services/empresas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modalDeletar.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css'],
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  empresasPaginados: Empresa[] = [];
  itensPorPagina = 5;
  paginaAtual = 1;
  totalPaginas = 0;
  selectedEmpresa: any = null;

  permissaoUsuario: string = '';

  constructor(
    private router: Router,
    private empresasService: EmpresasService,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.fetchEmpresas();
    this.atualizarPaginacao();

    // 🔸 Obter permissão do usuário autenticado
    const usuario = this.authService.getUsuarioAutenticado();
    if (usuario && usuario.permissao) {
      switch (usuario.permissao) {
        case 'ROLE_ADMIN':
          this.permissaoUsuario = 'Administrador';
          break;
        case 'ROLE_COORDENADOR':
          this.permissaoUsuario = 'Coordenador';
          break;
        case 'ROLE_USER':
          this.permissaoUsuario = 'Colaborador';
          break;
        default:
          this.permissaoUsuario = 'Desconhecido';
      }
    }
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
    this.empresasService.deletarEmpresa(id).subscribe(
      () => {
        this.empresas = this.empresas.filter((empresa) => empresa.id !== id);
        this.totalPaginas = Math.ceil(
          this.empresas.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
      },
      (error: any) => {
        console.error('Erro ao excluir empresa:', error);
      }
    );
  }

  editarEmpresa(id: string): void {
    this.router.navigate(['/usuario/cadastro-de-empresa', id]);
  }

  openModalDeletar(empresa: any): void {
    this.selectedEmpresa = empresa;

    this.modalService.openModal(
      {
        title: 'Remoção de Empresa',
        description: `Tem certeza que deseja excluir a empresa <strong>${empresa.razaoSocial}</strong> cadastrada?`,
        item: empresa,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        this.deletarEmpresa(empresa.id);
      }
    );
  }
}
