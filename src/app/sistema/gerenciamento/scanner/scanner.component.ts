import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ModalCadastroService } from 'src/app/services/modal/modal-cadastro.service';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { Colaborador } from '../../administrativo/colaboradores/colaborador';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';
import { AutoCompleteOption } from 'src/app/shared/select-auto-complete/select-auto-complete.component';
import { ScannerRunResponseDTO } from './scanner';
import {
  ScannerService,
  ScannerResponse,
} from 'src/app/services/gerenciamento/scanner.service';
import { FeedbackComponent } from 'src/app/shared/feedback/feedback.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnInit {
  scannerForm: FormGroup;
  resultadoScanner: ScannerResponse | null = null;

  colaboradores: Colaborador[] = [];
  empresasOptions: AutoCompleteOption[] = [];
  empresaSelecionada: string = '';

  isLoading = false;

  @ViewChild('formCadastroTemplate') formCadastroTemplate!: TemplateRef<any>;
  @ViewChild(FeedbackComponent) feedbackComponent!: FeedbackComponent;

  planilhasComErros: { nome: string; qtd: number; percent: number }[] = [];
  graficoData: any = null;

  graficoErrosCorretos: { series: number[]; labels: string[] } = {
    series: [],
    labels: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalCadastroService: ModalCadastroService,
    private colaboradoresService: ColaboradoresService,
    private authService: AuthService,
    private empresasService: EmpresasService,
    private documentosService: ScannerService,
    private router: Router
  ) {
    this.scannerForm = this.formBuilder.group({
      documentoCorreto: [[]],
      documentoIncorreto: [[]],
      empresaSelecionada: [''],
      descricao: [''],
    });
  }

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  ngOnChanges(): void {
    if (this.resultadoScanner) {
      this.processarResultado();
    }
  }

  historicoMovimentacao(): void {
    this.router.navigate(['/usuario/historico-movimentacao']);
  }

  // limparArquivos(): void {
  //   this.scannerForm.get('documentoCorreto')?.setValue([]);
  //   this.scannerForm.get('documentoIncorreto')?.setValue([]);
  // }

  removerArquivoCorreto(index: number): void {
    const arquivos = [
      ...(this.scannerForm.get('documentoCorreto')?.value || []),
    ];
    arquivos.splice(index, 1);
    this.scannerForm.get('documentoCorreto')?.setValue(arquivos);
  }

  removerArquivoIncorreto(index: number): void {
    const arquivos = [
      ...(this.scannerForm.get('documentoIncorreto')?.value || []),
    ];
    arquivos.splice(index, 1);
    this.scannerForm.get('documentoIncorreto')?.setValue(arquivos);
  }

  inverterArquivos(): void {
    const corretos = this.scannerForm.get('documentoCorreto')?.value || [];
    const incorretos = this.scannerForm.get('documentoIncorreto')?.value || [];
    this.scannerForm.get('documentoCorreto')?.setValue(incorretos);
    this.scannerForm.get('documentoIncorreto')?.setValue(corretos);
  }

  get documentoCorretoArquivos() {
    return this.scannerForm.get('documentoCorreto')?.value || [];
  }

  get documentoIncorretoArquivos() {
    return this.scannerForm.get('documentoIncorreto')?.value || [];
  }

  processarArquivos(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario) => {
        this.openModalCadastro(usuario);
      },
      error: (err) => {},
    });
  }

  openModalCadastro(colaborador: Colaborador): void {
    this.colaboradoresService
      .getUsuarioById(colaborador.id)
      .subscribe((colab) => {
        this.modalCadastroService.openModal(
          {
            title: 'Analisar arquivos',
            description: `Preencha os dados para a análise`,
            size: 'lg',
            confirmTextoBotao: 'Começar análise',
          },
          () => this.onSubmit(colab),
          this.formCadastroTemplate
        );
      });
  }

  onSubmit(colab: Colaborador): void {
    const arquivosCorretos: File[] =
      this.scannerForm.get('documentoCorreto')?.value || [];
    const arquivosIncorretos: File[] =
      this.scannerForm.get('documentoIncorreto')?.value || [];
    let empresaSelecionada = this.scannerForm.get('empresaSelecionada')?.value;

    if (Array.isArray(empresaSelecionada)) {
      empresaSelecionada = empresaSelecionada[0] || '';
    }
    const descricao: string = this.scannerForm.get('descricao')?.value || '';

    const meta = JSON.stringify({
      empresaId: empresaSelecionada,
      descricao,
      // colaboradorId: colab.id,
    });

    // MONTA O FORM DATA MANUALMENTE PARA LOG
    const formData = new FormData();
    arquivosCorretos.forEach((file) =>
      formData.append('correct', file, file.name)
    );
    arquivosIncorretos.forEach((file) =>
      formData.append('incorrect', file, file.name)
    );
    if (meta) {
      formData.append('meta', meta);
    }

    // LOG DO QUE ESTÁ SENDO ENVIADO
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.isLoading = true;
    this.resultadoScanner = null;

    this.documentosService
      .enviarArquivosParaScanner(arquivosCorretos, arquivosIncorretos, meta)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.resultadoScanner = res;
          this.scannerForm.get('documentoCorreto')?.setValue([]);
          this.scannerForm.get('documentoIncorreto')?.setValue([]);
          this.showFeedback('success', 'Análise concluída com sucesso!');
          this.processarResultado();
        },
        error: (err) => {
          this.isLoading = false;
          this.showFeedback('error', 'Erro ao enviar arquivos para análise!');
        },
      });
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

  onEmpresaSelecionada(empresa: string | string[]): void {
    // Se vier array, pega o primeiro valor
    if (Array.isArray(empresa)) {
      this.empresaSelecionada = empresa[0] || '';
    } else {
      this.empresaSelecionada = empresa;
    }
    console.log(
      'Empresa selecionada:',
      this.empresaSelecionada,
      typeof this.empresaSelecionada
    );
  }

  private showFeedback(
    type: 'success' | 'error' | 'info',
    message: string,
    description?: string
  ): void {
    if (this.feedbackComponent) {
      this.feedbackComponent.show(type, message, description);
    }
  }

  processarResultado(): void {
    const errors = this.resultadoScanner?.errors || {};
    const totalErros = Object.values(errors).reduce(
      (acc, arr) => acc + arr.length,
      0
    );
    const totalCorretos = this.resultadoScanner?.corrections?.length || 0;

    this.planilhasComErros = Object.keys(errors).map((nome) => {
      const qtd = errors[nome].length;
      const percent = totalErros ? Math.round((qtd / totalErros) * 100) : 0;
      return { nome, qtd, percent };
    });

    // Dados para o gráfico rosquinha
    this.graficoErrosCorretos = {
      series: [totalErros, totalCorretos],
      labels: ['Erros encontrados', 'Planilhas corrigidas'],
    };
  }

  baixarZip(): void {
    if (!this.resultadoScanner?.id) return;
    this.documentosService
      .baixarCorrecaoZip(this.resultadoScanner.id)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'correcoes.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  baixarPdf(): void {
    if (!this.resultadoScanner?.id) return;
    this.documentosService
      .baixarRelatorioScanner(this.resultadoScanner.id)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analise.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  limparArquivos(): void {
    this.scannerForm.reset();
    this.resultadoScanner = null;
    this.planilhasComErros = [];
    this.graficoData = null;
  }
}
