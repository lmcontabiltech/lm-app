import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnInit {
  scannerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
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
    const arquivos = [...(this.scannerForm.get('documentoCorreto')?.value || [])];
    arquivos.splice(index, 1);
    this.scannerForm.get('documentoCorreto')?.setValue(arquivos);
  }

  removerArquivoIncorreto(index: number): void {
    const arquivos = [...(this.scannerForm.get('documentoIncorreto')?.value || [])];
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
}
