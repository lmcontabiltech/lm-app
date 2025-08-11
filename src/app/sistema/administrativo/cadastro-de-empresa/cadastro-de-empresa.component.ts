import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../empresas/empresa';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { EmpresasService } from '../../../services/administrativo/empresas.service';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { RegimeDaEmpresa } from '../empresas/enums/regime-da-empresa';
import { RegimeDaEmpresaDescricao } from '../empresas/enums/regime-da-empresa-descricao';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorMessageService } from 'src/app/services/feedback/error-message.service';
import { ControleDeParcelamento } from '../empresas/enums/controle-de-parcelamento';
import { ControleDeParcelamentoDescricao } from '../empresas/enums/controle-de-parcelamento-descricao';
import { Situacao } from '../empresas/enums/situacao';
import { SituacaoDescricao } from '../empresas/enums/situacao-descricao';
import { TipoEmpresa } from '../empresas/enums/tipo-empresa';
import { TipoEmpresaDescricao } from '../empresas/enums/tipo-empresa-descricao';
import { EnderecoService, Estado } from 'src/app/services/endereco.service';

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
  status: string = 'ATIVO';
  unidadeEmpresa: string = 'MATRIZ';

  funcionariosFiscal: { value: string; description: string }[] = [];
  selectedFiscal: { value: string; description: string }[] = [];
  funcionariosFinanceiro: { value: string; description: string }[] = [];
  selectedFinanceiro: { value: string; description: string }[] = [];
  funcionariosParalegal: { value: string; description: string }[] = [];
  selectedParalegal: { value: string; description: string }[] = [];
  funcionariosPessoal: { value: string; description: string }[] = [];
  selectedPessoal: { value: string; description: string }[] = [];
  funcionariosContabil: { value: string; description: string }[] = [];
  selectedContabil: { value: string; description: string }[] = [];

  regimes = Object.keys(RegimeDaEmpresa).map((key) => ({
    value: RegimeDaEmpresa[key as keyof typeof RegimeDaEmpresa],
    description:
      RegimeDaEmpresaDescricao[
        RegimeDaEmpresa[key as keyof typeof RegimeDaEmpresa]
      ],
  }));
  selectedRegime: string = '';

  controleParcelamento = Object.keys(ControleDeParcelamento).map((key) => ({
    value: ControleDeParcelamento[key as keyof typeof ControleDeParcelamento],
    description:
      ControleDeParcelamentoDescricao[
        ControleDeParcelamento[key as keyof typeof ControleDeParcelamento]
      ],
  }));
  selectedControleParcelamento: { value: string; description: string }[] = [];

  situacao = Object.keys(Situacao).map((key) => ({
    value: Situacao[key as keyof typeof Situacao],
    description: SituacaoDescricao[Situacao[key as keyof typeof Situacao]],
  }));
  selectedSituacao: string = '';

  tipoEmpresa = Object.keys(TipoEmpresa).map((key) => ({
    value: TipoEmpresa[key as keyof typeof TipoEmpresa],
    description:
      TipoEmpresaDescricao[TipoEmpresa[key as keyof typeof TipoEmpresa]],
  }));
  selectedTipoEmpresa: string = '';

  estados: { value: string; description: string }[] = [];
  selectedEstado: string = '';
  cidades: { value: string; description: string }[] = [];
  selectedCidade: string = '';

  empresasMatriz: { value: string; description: string }[] = [];
  selectedMatriz: string = '';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private colaboradorService: ColaboradoresService,
    private errorMessageService: ErrorMessageService,
    private enderecoService: EnderecoService
  ) {
    this.empresaForm = this.formBuilder.group({
      razaoSocial: ['', Validators.required],
      cnpj: ['', Validators.required],
      regimeEmpresa: ['', Validators.required],
      codQuestor: ['', Validators.required],
      codEmpDominio: ['', Validators.required],
      identificadorContabil: [[]],
      identificadorFiscal: [[]],
      identificadorFinanceiro: [[]],
      identificadorParalegal: [[]],
      identificadorPessoal: [[]],
      // identificadorJuridico: [''],
      // identificadorEstagiario: [''],
      // identificadorOutros: [''],
      status: ['ATIVO'],
      controleParcelamento: [[]],
      situacao: ['', Validators.required],
      tipo: ['', Validators.required],
      estado: [''],
      cidade: [''],
      unidadeEmpresa: ['MATRIZ'],
      identificadorEmpresaMatriz: [''],
    });
  }

  ngOnInit(): void {
    this.verificarModoEdicao();
    this.carregarFuncionarios();
    this.carregarEstadosECidades();
    this.carregarEmpresas();
    const usuario = this.authService.getUsuarioAutenticado();
    if (usuario?.permissao) {
      this.permissaoUsuario = this.mapPermissao(usuario.permissao);
    }

    this.empresaForm.get('unidadeEmpresa')?.valueChanges.subscribe((valor) => {
      if (valor === 'MATRIZ') {
        this.selectedMatriz = '';
        this.empresaForm.get('identificadorEmpresaMatriz')?.setValue('');
      }
    });
  }

  private mapPermissao(permissao: string): string {
    switch (permissao) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_COORDENADOR':
        return 'Coordenador';
      case 'ROLE_USER':
        return 'Colaborador';
      case 'ROLE_ESTAGIARIO':
        return 'Estagiario';
      default:
        return 'Desconhecido';
    }
  }

  goBack() {
    this.location.back();
  }

  carregarEmpresas(callback?: () => void): void {
    this.empresasService.getEmpresas().subscribe(
      (empresas) => {
        this.empresasMatriz = empresas.map((empresa) => ({
          value: empresa.id,
          description: empresa.razaoSocial,
        }));
        if (callback) callback();
      },
      (error) => {
        console.error('Erro ao carregar as empresas:', error);
        if (callback) callback();
      }
    );
  }

  onSubmit(): void {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const empresa: Empresa = {
      ...this.empresaForm.value,
      identificadorFiscal: this.selectedFiscal.map((u) => u.value),
      identificadorFinanceiro: this.selectedFinanceiro.map((u) => u.value),
      identificadorParalegal: this.selectedParalegal.map((u) => u.value),
      identificadorPessoal: this.selectedPessoal.map((u) => u.value),
      identificadorContabil: this.selectedContabil.map((u) => u.value),
      controleParcelamento: this.selectedControleParcelamento.map(
        (u) => u.value
      ),
    };

    console.log('Dados enviados para o backend:', empresa);

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
          this.errorMessage = this.errorMessageService.getErrorMessage(
            error.status,
            'PUT',
            'empresa'
          );
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
          if (
            error.status === 409 &&
            error.error &&
            typeof error.error.message === 'string' &&
            error.error.message.toLowerCase().includes('cnpj')
          ) {
            this.errorMessage =
              'Já existe uma empresa cadastrada com este CNPJ.';
          } else {
            this.errorMessage = this.errorMessageService.getErrorMessage(
              error.status,
              'POST',
              'empresa'
            );
          }
          this.successMessage = null;
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
        console.log('Empresa recebida do backend:', empresa);

        this.carregarEmpresas(() => {
          // Preenche o select de empresa matriz
          this.selectedMatriz = empresa.matriz?.id || '';
          this.empresaForm
            .get('identificadorEmpresaMatriz')
            ?.setValue(this.selectedMatriz);
        });

        const estado = empresa.estado;
        const cidade = empresa.cidade;

        this.empresaForm.patchValue({
          ...empresa,
        });

        this.enderecoService.getCidadesByEstado(estado).subscribe((cidades) => {
          this.cidades = cidades.map((cidade) => ({
            value: cidade.nome,
            description: cidade.nome,
          }));
          this.selectedCidade = cidade;
          this.empresaForm.get('cidade')?.setValue(cidade);
        });

        this.tratarColaboradores(empresa);
        this.selectedRegime = empresa.regimeEmpresa || '';
        this.selectedSituacao = empresa.situacao || '';
        this.selectedTipoEmpresa = empresa.tipo || '';
        this.selectedEstado = estado;
        this.empresaForm.get('cidade')?.enable();
        let controleParcelamentoArr: string[] = [];
        if (Array.isArray(empresa.controleParcelamento)) {
          controleParcelamentoArr = empresa.controleParcelamento;
        } else if (
          typeof empresa.controleParcelamento === 'string' &&
          empresa.controleParcelamento
        ) {
          controleParcelamentoArr = [empresa.controleParcelamento];
        }

        this.selectedControleParcelamento = controleParcelamentoArr.map(
          (value: string) => {
            const found = this.controleParcelamento.find(
              (opt) => opt.value === value
            );
            return found ? found : { value, description: value };
          }
        );
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = this.errorMessageService.getErrorMessage(
          error.status,
          'GET',
          'empresa'
        );
        this.successMessage = null;
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
          this.errorMessage = this.errorMessageService.getErrorMessage(
            error.status,
            'GET',
            'colaboradores'
          );
        }
      );
    });
  }

  private tratarColaboradores(empresa: Empresa): void {
    if (empresa.fiscal && Array.isArray(empresa.fiscal)) {
      this.selectedFiscal = empresa.fiscal.map((user) => ({
        value: user.id,
        description: user.nome,
      }));
    }
    if (empresa.financeiro && Array.isArray(empresa.financeiro)) {
      this.selectedFinanceiro = empresa.financeiro.map((user) => ({
        value: user.id,
        description: user.nome,
      }));
    }
    if (empresa.paralegal && Array.isArray(empresa.paralegal)) {
      this.selectedParalegal = empresa.paralegal.map((user) => ({
        value: user.id,
        description: user.nome,
      }));
    }
    if (empresa.pessoal && Array.isArray(empresa.pessoal)) {
      this.selectedPessoal = empresa.pessoal.map((user) => ({
        value: user.id,
        description: user.nome,
      }));
    }
    if (empresa.contabil && Array.isArray(empresa.contabil)) {
      this.selectedContabil = empresa.contabil.map((user) => ({
        value: user.id,
        description: user.nome,
      }));
    }
  }

  onEstadoChange(nome: string): void {
    const cidadeControl = this.empresaForm.get('cidade');

    this.empresaForm.get('estado')?.setValue(nome);

    if (!nome) {
      cidadeControl?.disable();
      this.enderecoService.getTodasCidades().subscribe((cidades) => {
        this.cidades = cidades.map((cidade) => ({
          value: cidade.nome,
          description: cidade.nome,
        }));
        this.selectedCidade = '';
        cidadeControl?.setValue(null);
      });
    } else {
      cidadeControl?.enable();
      this.enderecoService.getCidadesByEstado(nome).subscribe((cidades) => {
        this.cidades = cidades.map((cidade) => ({
          value: cidade.nome,
          description: cidade.nome,
        }));
        this.selectedCidade = '';
        cidadeControl?.setValue(null);
      });
    }
  }

  onCidadeChange(nome: string): void {
    this.empresaForm.get('cidade')?.setValue(nome);
  }

  private carregarEstadosECidades(): void {
    this.enderecoService.getEstados().subscribe((estados: Estado[]) => {
      this.estados = estados.map((estado: Estado) => ({
        value: estado.sigla,
        description: estado.nome,
      }));
    });

    this.onEstadoChange('');
  }

  isRequired(controlName: string): boolean {
    const control = this.empresaForm.get(controlName);
    if (control && control.validator) {
      const validator = control.validator({} as AbstractControl);
      return !!(validator && validator['required']);
    }
    return false;
  }

  get matrizSelecionada(): boolean {
    return this.empresaForm.get('unidadeEmpresa')?.value === 'MATRIZ';
  }
}
