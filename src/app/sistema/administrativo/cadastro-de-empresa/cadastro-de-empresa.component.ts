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

  controleParcelamento = Object.keys(ControleDeParcelamento).map((key) => ({
    value: ControleDeParcelamento[key as keyof typeof ControleDeParcelamento],
    description:
      ControleDeParcelamentoDescricao[
        ControleDeParcelamento[key as keyof typeof ControleDeParcelamento]
      ],
  }));
  selectedControleParcelamento: string = '';

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
      identificadorContabil: [''],
      identificadorFiscal: [''],
      identificadorFinanceiro: [''],
      identificadorParalegal: [''],
      identificadorPessoal: [''],
      status: ['ATIVO'],
      controleParcelamento: [''],
      situacao: [''],
      tipo: [''],
      estado: [''],
      cidade: [''],
    });
  }

  ngOnInit(): void {
    this.verificarModoEdicao();
    this.carregarFuncionarios();
    this.carregarEstadosECidades();
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
        this.selectedControleParcelamento = empresa.controleParcelamento || '';
        this.selectedSituacao = empresa.situacao || '';
        this.selectedTipoEmpresa = empresa.tipo || '';
        this.selectedEstado = estado;
        this.empresaForm.get('cidade')?.enable();
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

  onEstadoChange(nome: string): void {
    const cidadeControl = this.empresaForm.get('cidade');

    console.log('onEstadoChange chamado com o estado:', nome);
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
        console.log('Cidades filtradas pelo estado:', cidades);
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
    console.log('onCidadeChange chamado com a cidade:', nome);
    this.empresaForm.get('cidade')?.setValue(nome);
  }

  private carregarEstadosECidades(): void {
    this.enderecoService.getEstados().subscribe((estados: Estado[]) => {
      this.estados = estados.map((estado: Estado) => ({
        value: estado.sigla,
        description: estado.nome,
      }));
      console.log('Estados carregados:', this.estados);
    });

    this.onEstadoChange('');
  }
}
