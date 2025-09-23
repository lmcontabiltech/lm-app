import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnInit {
  documentoCorretoArquivos: (
    | File
    | { id: number; name: string; documentoUrl: string }
  )[] = [];
  documentoIncorretoArquivos: (
    | File
    | { id: number; name: string; documentoUrl: string }
  )[] = [];

  constructor() {}

  ngOnInit(): void {}

  limparArquivos(): void {
    this.documentoCorretoArquivos = [];
    this.documentoIncorretoArquivos = [];
  }

  removerArquivoCorreto(index: number): void {
    this.documentoCorretoArquivos.splice(index, 1);
  }

  removerArquivoIncorreto(index: number): void {
    this.documentoIncorretoArquivos.splice(index, 1);
  }

  inverterArquivos(): void {
    const temp = this.documentoCorretoArquivos;
    this.documentoCorretoArquivos = this.documentoIncorretoArquivos;
    this.documentoIncorretoArquivos = temp;
  }
}
