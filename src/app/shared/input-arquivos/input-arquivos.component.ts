import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { DocumentosService } from 'src/app/services/gerenciamento/documentos.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-arquivos',
  templateUrl: './input-arquivos.component.html',
  styleUrls: ['./input-arquivos.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputArquivosComponent),
      multi: true,
    },
  ],
})
export class InputArquivosComponent {
  @Input() label: string = 'Clique ou arraste o arquivo para fazer upload';
  @Output() arquivosSelecionados = new EventEmitter<
    (File | { id: number; name: string; documentoUrl: string })[]
  >();
  @Input() multiple: boolean = true;
  @Input() layout: 'list' | 'grid' = 'list';
  @Input() showList: boolean = true;
  @Input() accept: string = 'application/pdf';
  @Input() inputId: string =
    'arquivo-' + Math.random().toString(36).substring(2, 9);

  successMessage: string | null = null;
  errorMessage: string | null = null;
  arquivos: (File | { id: number; name: string; documentoUrl: string })[] = [];
  onChange: (
    value: (File | { id: number; name: string; documentoUrl: string })[]
  ) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private documentosService: DocumentosService) {}

  ngOnInit(): void {
    console.log('InputArquivosComponent inicializado');
  }

  writeValue(
    value: (File | { id: number; name: string; documentoUrl: string })[]
  ): void {
    this.arquivos = value || [];
  }

  registerOnChange(
    fn: (
      value: (File | { id: number; name: string; documentoUrl: string })[]
    ) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.adicionarArquivos(Array.from(input.files));
    }
  }

  removePdf(index: number): void {
    const arquivoRemovido = this.arquivos[index];
    this.arquivos.splice(index, 1);

    if (this.isArquivoComUrl(arquivoRemovido)) {
      console.log('Removendo arquivo com URL:', arquivoRemovido);
      this.documentosService
        .deleteDocumentoById(arquivoRemovido.id.toString())
        .subscribe({
          next: () => {
            console.log(
              'Arquivo removido com sucesso no backend:',
              arquivoRemovido
            );
          },
          error: (error) => {
            console.error('Erro ao remover o arquivo no backend:', error);
          },
        });
    }
    this.onChange([...this.arquivos]);
    this.arquivosSelecionados.emit([...this.arquivos]);

    if (this.arquivos.length < 3) {
      this.errorMessage = null;
    }

    this.resetInput();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.adicionarArquivos(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  adicionarArquivos(novosArquivos: File[]): void {
    if (this.multiple) {
      for (let arquivo of novosArquivos) {
        if (!this.arquivos.some((a) => this.isSameArquivo(a, arquivo))) {
          this.arquivos.push(arquivo);
        }
      }
    } else {
      this.arquivos = [novosArquivos[0]];
    }
    this.onChange([...this.arquivos]);
    this.arquivosSelecionados.emit([...this.arquivos]);
    this.errorMessage = null;

    this.resetInput();
  }

  isSameArquivo(
    a: File | { id: number; name: string; documentoUrl: string },
    b: File | { id: number; name: string; documentoUrl: string }
  ): boolean {
    if (a instanceof File && b instanceof File) {
      return a.name === b.name && a.size === b.size;
    }
    if ('documentoUrl' in a && 'documentoUrl' in b) {
      return a.documentoUrl === b.documentoUrl;
    }
    return false;
  }

  isArquivoComUrl(
    arquivo: File | { id: number; name: string; documentoUrl: string }
  ): arquivo is { id: number; name: string; documentoUrl: string } {
    return !(arquivo instanceof File);
  }

  arquivoHasDocumentoUrl(
    arquivo: File | { id: number; name: string; documentoUrl: string }
  ): arquivo is { id: number; name: string; documentoUrl: string } {
    return (arquivo as { documentoUrl: string }).documentoUrl !== undefined;
  }

  resetInput(): void {
    const inputElement = document.getElementById(
      this.inputId
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = ''; // Reseta o valor do input
    }
  }
}
