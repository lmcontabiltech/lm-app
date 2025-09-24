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

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnInit {
  scannerForm: FormGroup;

  colaboradores: Colaborador[] = [];

  @ViewChild('formCadastroTemplate') formCadastroTemplate!: TemplateRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    private modalCadastroService: ModalCadastroService,
    private colaboradoresService: ColaboradoresService,
    private authService: AuthService
  ) {
    this.scannerForm = this.formBuilder.group({
      documentoCorreto: [[]],
      documentoIncorreto: [[]],
    });
  }

  ngOnInit(): void {}

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
        this.scannerForm.reset();
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
}
