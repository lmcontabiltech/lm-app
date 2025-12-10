import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../empresas/empresa';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormArray,
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
import { PorteEmpresa } from '../empresas/enums/porte-empresa';
import { PorteEmpresaDescricao } from '../empresas/enums/porte-empresa-descricao';
import { NaturezaJuridica } from '../empresas/enums/natureza-juridica';
import { NaturezaJuridicaDescricao } from '../empresas/enums/natureza-juridica-descricao';
import { TipoIdentificacao } from '../empresas/enums/tipo-identificacao';
import { TipoIdentificacaoDescricao } from '../empresas/enums/tipo-identificacao-descricao';
import { EnderecoService, Estado } from 'src/app/services/endereco.service';
import { EstadoCivil } from '../empresas/enums/estado-civil';
import { EstadoCivilDescricoes } from '../empresas/enums/estado-civil-descricoes';
import { ModalCadastroService } from 'src/app/services/modal/modal-cadastro.service';
import { Socio } from '../empresas/socio';

@Component({
  selector: 'app-cadastro-de-empresa',
  templateUrl: './cadastro-de-empresa.component.html',
  styleUrls: ['./cadastro-de-empresa.component.css'],
})
export class CadastroDeEmpresaComponent implements OnInit {
  empresaForm: FormGroup;
  formData = new FormData();
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

  porteEmpresa = Object.keys(PorteEmpresa).map((key) => ({
    value: PorteEmpresa[key as keyof typeof PorteEmpresa],
    description:
      PorteEmpresaDescricao[PorteEmpresa[key as keyof typeof PorteEmpresa]],
  }));
  selectedPorteEmpresa: string = '';

  naturezaJuridica = Object.keys(NaturezaJuridica).map((key) => ({
    value: NaturezaJuridica[key as keyof typeof NaturezaJuridica],
    description:
      NaturezaJuridicaDescricao[
        NaturezaJuridica[key as keyof typeof NaturezaJuridica]
      ],
  }));
  selectedNaturezaJuridica: string = '';

  tipoIdentificacao = Object.keys(TipoIdentificacao).map((key) => ({
    value: TipoIdentificacao[key as keyof typeof TipoIdentificacao],
    description:
      TipoIdentificacaoDescricao[
        TipoIdentificacao[key as keyof typeof TipoIdentificacao]
      ],
  }));
  selectedTipoIdentificacao: string = '';

  estadoCivil = Object.keys(EstadoCivil).map((key) => ({
    value: EstadoCivil[key as keyof typeof EstadoCivil],
    description:
      EstadoCivilDescricoes[EstadoCivil[key as keyof typeof EstadoCivil]],
  }));
  selectedEstadoCivil: string = '';

  estados: { value: string; description: string }[] = [];
  selectedEstado: string = '';
  cidades: { value: string; description: string }[] = [];
  selectedCidade: string = '';

  empresasMatriz: { value: string; description: string }[] = [];
  selectedMatriz: string = '';

  selectedArquivos: (
    | File
    | { documentoUrl: string; id: number; name: string }
  )[] = [];

  @ViewChild('formCadastroTemplate') formCadastroTemplate!: TemplateRef<any>;
  cidadesModal: { value: string; description: string }[] = [];
  selectedEstadoSocio: string = '';
  selectedCidadeSocio: string = '';
  private socioEditIndex: number | null = null;
  // form do sócio usado no modal
  socioForm: FormGroup = this.formBuilder.group({
    nome: [''],
    cpf: [''],
    email: [''],
    inscricaoEstadual: [''],
    estadoCivil: [''],
    telefone: [''],
    whatsapp: [''],
    endereco: this.formBuilder.group({
      estado: [''],
      cidade: [''],
      cep: [''],
      bairro: [''],
      rua: [''],
      numero: [''],
      logradouro: [''],
      complemento: [''],
    }),
  });

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private colaboradorService: ColaboradoresService,
    private errorMessageService: ErrorMessageService,
    private enderecoService: EnderecoService,
    private modalCadastroService: ModalCadastroService
  ) {
    this.empresaForm = this.formBuilder.group({
      razaoSocial: ['', Validators.required],
      tipoIdentificacao: ['CNPJ', Validators.required],
      cnpj: [''],
      cpf: [''],
      regimeEmpresa: ['', Validators.required],
      codQuestor: ['', Validators.required],
      codEmpDominio: ['', Validators.required],
      identificadorContabil: [[]],
      identificadorFiscal: [[]],
      identificadorFinanceiro: [[]],
      identificadorParalegal: [[]],
      identificadorPessoal: [[]],
      status: ['ATIVO'],
      controleParcelamento: [[]],
      situacao: ['', Validators.required],
      porteEmpresa: ['', Validators.required],
      naturezaJuridica: ['', Validators.required],
      unidadeEmpresa: ['MATRIZ'],
      identificadorEmpresaMatriz: [''],
      endereco: this.formBuilder.group({
        estado: [''],
        cidade: [''],
        cep: [''],
        bairro: [''],
        rua: [''],
        numero: [''],
        logradouro: [''],
        complemento: [''],
      }),
      arquivos: [[]],
      socios: this.formBuilder.array([]),
    });
    this.selectedTipoIdentificacao = 'CNPJ';
    this.updateIdentificacaoValidators(this.selectedTipoIdentificacao);

    this.empresaForm
      .get('tipoIdentificacao')
      ?.valueChanges.subscribe((valor) => {
        this.selectedTipoIdentificacao = valor;
        this.updateIdentificacaoValidators(valor);
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
      default:
        return 'Desconhecido';
    }
  }

  goBack() {
    this.location.back();
  }

  onArquivosSelecionados(
    arquivos: (File | { id: number; name: string; documentoUrl: string })[]
  ): void {
    this.selectedArquivos = arquivos;
    this.empresaForm.get('arquivos')?.setValue(arquivos);
    console.log('Arquivos selecionados:', arquivos);
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

    if (this.selectedTipoIdentificacao === 'CPF') {
      delete (empresa as any).cnpj;
    } else if (this.selectedTipoIdentificacao === 'CNPJ') {
      delete (empresa as any).cpf;
    }

    const formData = new FormData();
    formData.append('dto', JSON.stringify(empresa));

    // Adiciona os documentos ao FormData
    const arquivos = this.empresaForm.get('arquivos')?.value || [];
    arquivos.forEach((arquivo: File) => {
      formData.append('arquivos', arquivo);
    });

    console.log('Dados enviados para o backend:', empresa);

    if (this.isEditMode && this.empresaId) {
      this.empresasService.atualizarEmpresa(this.empresaId, formData).subscribe(
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
      this.empresasService.cadastrarEmpresa(formData).subscribe(
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

        const estado = empresa.endereco?.estado || empresa.estado || '';
        const cidade = empresa.endereco?.cidade || empresa.cidade || '';

        this.empresaForm.patchValue({
          ...empresa,
          endereco: {
            ...(this.empresaForm.get('endereco')?.value || {}),
            ...(empresa.endereco || {}),
            estado,
            cidade,
          },
        });

        const tipoFromServer =
          empresa.tipoIdentificacao ||
          (empresa.cpf ? 'CPF' : empresa.cnpj ? 'CNPJ' : null);
        if (tipoFromServer) {
          this.empresaForm.get('tipoIdentificacao')?.setValue(tipoFromServer);
          this.selectedTipoIdentificacao = tipoFromServer;
          this.updateIdentificacaoValidators(tipoFromServer);
        }

        this.enderecoService.getCidadesByEstado(estado).subscribe((cidades) => {
          this.cidades = cidades.map((cidade) => ({
            value: cidade.nome,
            description: cidade.nome,
          }));
          this.selectedCidade = cidade;
          this.empresaForm.get('endereco.cidade')?.setValue(cidade);
        });

        if (empresa.documentos && Array.isArray(empresa.documentos)) {
          const documentosMapeados = empresa.documentos.map((d) => ({
            documentoUrl: d.url,
            id: d.id,
            name: d.fileName,
          }));

          this.empresaForm.get('arquivos')?.setValue(documentosMapeados);
          this.selectedArquivos = documentosMapeados;

          console.log(
            'Arquivos carregados no FormControl:',
            documentosMapeados
          );
        }

        this.tratarColaboradores(empresa);
        this.selectedRegime = empresa.regimeEmpresa || '';
        this.selectedSituacao = empresa.situacao || '';
        this.selectedTipoEmpresa = empresa.tipo || '';
        this.selectedTipoIdentificacao = empresa.tipoIdentificacao || '';
        this.selectedPorteEmpresa = empresa.porteEmpresa || '';
        this.selectedNaturezaJuridica = empresa.naturezaJuridica || '';
        this.selectedEstado = estado;
        this.empresaForm.get('endereco.cidade')?.enable();
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
    const cidadeControl = this.empresaForm.get('endereco.cidade');

    this.empresaForm.get('endereco.estado')?.setValue(nome);

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
    this.empresaForm.get('endereco.cidade')?.setValue(nome);
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

  private updateIdentificacaoValidators(valor: string | null): void {
    const cpfControl = this.empresaForm.get('cpf');
    const cnpjControl = this.empresaForm.get('cnpj');

    cpfControl?.clearValidators();
    cnpjControl?.clearValidators();

    if (valor === 'CPF') {
      cpfControl?.setValidators([Validators.required]);
      cnpjControl?.setValue('');
    } else if (valor === 'CNPJ') {
      cnpjControl?.setValidators([Validators.required]);
      cpfControl?.setValue('');
    } else {
      cpfControl?.setValue('');
      cnpjControl?.setValue('');
    }

    cpfControl?.updateValueAndValidity();
    cnpjControl?.updateValueAndValidity();
  }

  private createSocioGroup(socio?: Partial<Socio>): FormGroup {
    return this.formBuilder.group({
      nome: [socio?.nome || ''],
      cpf: [socio?.cpf || ''],
      estadoCivil: [socio?.estadoCivil || ''],
      email: [socio?.email || ''],
      inscricaoEstadual: [socio?.inscricaoEstadual || ''],
      telefone: [socio?.telefone || ''],
      whatsapp: [socio?.whatsapp || ''],
      endereco: this.formBuilder.group({
        estado: [socio?.endereco?.estado || ''],
        cidade: [socio?.endereco?.cidade || ''],
        cep: [socio?.endereco?.cep || ''],
        bairro: [socio?.endereco?.bairro || ''],
        rua: [socio?.endereco?.rua || ''],
        numero: [socio?.endereco?.numero || ''],
        logradouro: [socio?.endereco?.logradouro || ''],
        complemento: [socio?.endereco?.complemento || ''],
      }),
    });
  }

  get socios(): FormArray {
    return this.empresaForm.get('socios') as FormArray;
  }

  addSocio(socio?: any): void {
    this.socios.push(this.createSocioGroup(socio));
  }

  removeSocio(index: number): void {
    this.socios.removeAt(index);
  }

  // abre o modal de cadastro de sócio; ao confirmar, adiciona ao FormArray
  openModalCadastro(): void {
    this.socioEditIndex = null;
    this.socioForm.reset({
      nome: '',
      cpf: '',
      email: '',
      inscricaoEstadual: '',
      estadoCivil: '',
      telefone: '',
      whatsapp: '',
      endereco: {
        estado: '',
        cidade: '',
        cep: '',
        bairro: '',
        rua: '',
        numero: '',
        logradouro: '',
        complemento: '',
      },
    });
    this.cidadesModal = [];
    this.selectedEstadoSocio = '';
    this.selectedCidadeSocio = '';
    const onConfirm = () => {
      const socio = this.socioForm.value as Socio;
      this.addSocio(socio);
      this.modalCadastroService.closeModal();
    };
    this.modalCadastroService.openModal(
      {
        title: 'Inserir sócio',
        description: 'Preencha os dados do sócio e confirme para adicionar.',
        size: 'md',
        confirmTextoBotao: 'Adicionar',
        cancelTextoBotao: 'Fechar',
      },
      onConfirm,
      this.formCadastroTemplate
    );
  }

  editarSocio(index: number): void {
    this.socioEditIndex = index;
    const socioGroup = this.socios.at(index) as FormGroup;
    this.socioForm.patchValue(socioGroup.value);
    const estadoSel = this.socioForm.get('endereco.estado')?.value || '';
    this.selectedEstadoSocio = estadoSel || '';
    this.selectedCidadeSocio =
      this.socioForm.get('endereco.cidade')?.value || '';
    if (estadoSel) {
      this.enderecoService
        .getCidadesByEstado(estadoSel)
        .subscribe((cidades) => {
          this.cidadesModal = cidades.map((c) => ({
            value: c.nome,
            description: c.nome,
          }));
        });
    } else {
      this.cidadesModal = [];
    }

    const onConfirm = () => {
      if (this.socioEditIndex != null) {
        const socioAtualizado = this.socioForm.value as Socio;
        (this.socios.at(this.socioEditIndex) as FormGroup).patchValue(
          socioAtualizado
        );
        this.socioEditIndex = null;
      }
      this.modalCadastroService.closeModal();
    };

    this.modalCadastroService.openModal(
      {
        title: 'Editar sócio',
        description: 'Atualize os dados do sócio e confirme.',
        size: 'md',
        confirmTextoBotao: 'Salvar',
        cancelTextoBotao: 'Fechar',
      },
      onConfirm,
      this.formCadastroTemplate
    );
  }

  onModalEstadoChange(estado: string): void {
    this.selectedEstadoSocio = estado || '';
    this.socioForm.get('endereco.estado')?.setValue(estado);
    if (!estado) {
      this.cidadesModal = [];
      this.socioForm.get('endereco.cidade')?.setValue('');
      this.selectedCidadeSocio = '';
      return;
    }
    this.enderecoService.getCidadesByEstado(estado).subscribe((cidades) => {
      this.cidadesModal = cidades.map((c) => ({
        value: c.nome,
        description: c.nome,
      }));
      this.socioForm.get('endereco.cidade')?.setValue('');
      this.selectedCidadeSocio = '';
    });
  }

  onModalCidadeChange(cidade: string): void {
    this.selectedCidadeSocio = cidade || '';
    this.socioForm.get('endereco.cidade')?.setValue(cidade);
  }
}
