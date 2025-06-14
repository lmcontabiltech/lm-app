import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../empresas/empresa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresasService } from '../../../services/administrativo/empresas.service';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { RegimeDaEmpresa } from '../empresas/enums/regime-da-empresa';
import { RegimeDaEmpresaDescricao } from '../empresas/enums/regime-da-empresa-descricao';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastro-de-empresa',
  templateUrl: './cadastro-de-empresa.component.html',
  styleUrls: ['./cadastro-de-empresa.component.css'],
})
export class CadastroDeEmpresaComponent implements OnInit {
  empresaForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  permissaoUsuario: string = '';
  isEditMode = false;
  empresaId: string | null = null;
  funcionariosFiscal: { value: string; description: string }[] = [];
  selectedFiscal: string = '';
  funcionariosFinanceiro: { value: string; description: string }[] = [];
  selectedFinanceiro: string = '';
  funcionariosParalegal: { value: string; description: string }[] = [];
  selectedParalegal: string = '';
  funcionariosPessoal: { value: string; description: string }[] = [];
  selectedPessoal: string = '';
  funcionariosContabil: { value: string; description: string }[] = [];
  selectedContabil: string = '';

  regimes = Object.keys(RegimeDaEmpresa).map((key) => ({
    value: RegimeDaEmpresa[key as keyof typeof RegimeDaEmpresa],
    description:
      RegimeDaEmpresaDescricao[
        RegimeDaEmpresa[key as keyof typeof RegimeDaEmpresa]
      ],
  }));

  selectedRegime: string = '';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private colaboradorService: ColaboradoresService
  ) {
    this.empresaForm = this.formBuilder.group({
      razaoSocial: ['', Validators.required],
      cnpj: ['', Validators.required],
      regimeEmpresa: ['', Validators.required],
      codQuestor: ['', Validators.required],
      codEmpDominio: ['', Validators.required],
      identificadorContabil: [''],
      identificadorFiscal: [''],
      identificadorFinanceiro: [''],
      identificadorParalegal: [''],
      identificadorPessoal: [''],
    });
  }

  ngOnInit(): void {
    this.verificarModoEdicao();
    this.carregarFuncionarios();

    const usuario = this.authService.getUsuarioAutenticado();
    if (usuario?.permissao) {
      this.permissaoUsuario = this.mapPermissao(usuario.permissao);
    }
  }

  private mapPermissao(permissao: string): string {
    switch (permissao) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_COORDENADOR':
        return 'Coordenador';
      case 'ROLE_USER':
        return 'Colaborador';
      default:
        return 'Desconhecido';
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const empresa: Empresa = {
      ...this.empresaForm.value,
    };

    console.log('Dados da empresa a serem enviados:', empresa);

    if (this.isEditMode && this.empresaId) {
      this.empresasService.atualizarEmpresa(this.empresaId, empresa).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Empresa atualizada com sucesso!';
          this.errorMessage = null;
          this.router.navigate(['/usuario/empresas'], {
            state: { successMessage: 'Empresa atualizada com sucesso!' },
          });
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao atualizar empresa.';
          this.successMessage = null;
        }
      );
    } else {
      this.empresasService.cadastrarEmpresa(empresa).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Empresa cadastrada com sucesso!';
          this.errorMessage = null;
          this.empresaForm.reset();
          this.router.navigate(['/usuario/empresas'], {
            state: { successMessage: 'Empresa cadastrada com sucesso!' },
          });
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao cadastrar empresa.';
          this.successMessage = null;
          console.error('Erro ao cadastrar empresa:', error);
        }
      );
    }
  }

  private verificarModoEdicao(): void {
    this.empresaId = this.route.snapshot.paramMap.get('id');
    if (this.empresaId) {
      this.isEditMode = true;
      this.carregarDadosEmpresa(this.empresaId);
    }


  }

  private carregarDadosEmpresa(empresaId: string): void {
    this.empresasService.getEmpresaById(empresaId).subscribe(
      (empresa: Empresa) => {
        console.log('Dados da empresa recebidos:', empresa);

        this.empresaForm.patchValue({
          ...empresa,
        });

        this.tratarColaboradores(empresa);
        this.selectedRegime = empresa.regimeEmpresa || '';
      },
      (error) => {
        console.error('Erro ao carregar os dados da empresa:', error);
      }
    );
  }

  carregarFuncionarios(): void {
    const setores = [
      { setor: 'CONTABIL', targetArray: 'funcionariosContabil' },
      { setor: 'FISCAL', targetArray: 'funcionariosFiscal' },
      { setor: 'FINANCEIRO', targetArray: 'funcionariosFinanceiro' },
      { setor: 'PARALEGAL', targetArray: 'funcionariosParalegal' },
      { setor: 'PESSOAL', targetArray: 'funcionariosPessoal' },
    ];

    setores.forEach(({ setor, targetArray }) => {
      this.colaboradorService.getUsuariosBySetor(setor).subscribe(
        (usuarios) => {
          (this[targetArray as keyof CadastroDeEmpresaComponent] as {
            value: string;
            description: string;
          }[]) = usuarios.map((usuario) => ({
            value: usuario.id,
            description: usuario.nome,
          }));
        },
        (error) => {
          console.error(
            `Erro ao carregar os usuários do setor ${setor}:`,
            error
          );
        }
      );
    });
  }

  private tratarColaboradores(empresa: Empresa): void {
    if (empresa.fiscal) {
      this.selectedFiscal = empresa.fiscal.id;
      this.funcionariosFiscal = [
        {
          value: empresa.fiscal.id,
          description: empresa.fiscal.nome,
        },
      ];
    }

    if (empresa.pessoal) {
      this.selectedPessoal = empresa.pessoal.id;
      this.funcionariosPessoal = [
        {
          value: empresa.pessoal.id,
          description: empresa.pessoal.nome,
        },
      ];
    }

    if (empresa.financeiro) {
      this.selectedFinanceiro = empresa.financeiro.id;
      this.funcionariosFinanceiro = [
        {
          value: empresa.financeiro.id,
          description: empresa.financeiro.nome,
        },
      ];
    }

    if (empresa.paralegal) {
      this.selectedParalegal = empresa.paralegal.id;
      this.funcionariosParalegal = [
        {
          value: empresa.paralegal.id,
          description: empresa.paralegal.nome,
        },
      ];
    }

    if (empresa.contabil) {
      this.selectedContabil = empresa.contabil.id;
      this.funcionariosContabil = [
        {
          value: empresa.contabil.id,
          description: empresa.contabil.nome,
        },
      ];
    }
  }
}
