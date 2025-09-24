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

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnInit {
  scannerForm: FormGroup;

  colaboradores: Colaborador[] = [];
  empresasOptions: AutoCompleteOption[] = [];
  empresasSelecionadas: string[] = [];

  isLoading = false;

  @ViewChild('formCadastroTemplate') formCadastroTemplate!: TemplateRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    private modalCadastroService: ModalCadastroService,
    private colaboradoresService: ColaboradoresService,
    private authService: AuthService,
    private empresasService: EmpresasService
  ) {
    this.scannerForm = this.formBuilder.group({
      documentoCorreto: [[]],
      documentoIncorreto: [[]],
      empresasSelecionadas: [[]],
      observacoes: [''],
    });
  }

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  limparArquivos(): void {
    this.scannerForm.get('documentoCorreto')?.setValue([]);
    this.scannerForm.get('documentoIncorreto')?.setValue([]);
  }

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

  onSubmit(colab: Colaborador): void {}

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

  onEmpresaSelecionada(empresas: string[]): void {
    this.empresasSelecionadas = empresas;
    console.log('Empresas selecionadas:', empresas);

    if (empresas && empresas.length > 0) {
      const idsEmpresas = empresas.map((id) => Number(id));
    } else {
    }
  }
}
