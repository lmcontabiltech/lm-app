import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-midias',
  templateUrl: './input-midias.component.html',
  styleUrls: ['./input-midias.component.css'],
})
export class InputMidiasComponent implements OnInit {
  @Input() label: string = 'Clique ou arraste a imagem/vídeo para fazer upload';
  @Input() inputId: string = 'midia';
  @Output() midiaSelected = new EventEmitter<File | null>();
  @Output() fileRemoved = new EventEmitter<void>();
  @Input() midiaPreview: string | ArrayBuffer | null = null;

  selectedFile: File | null = null;
  fileType: 'image' | 'video' | null = null;

  constructor() {}

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processFile(file, input);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const inputElement = document.getElementById(
        this.inputId
      ) as HTMLInputElement;
      this.processFile(file, inputElement);
    }
  }

  processFile(file: File, inputElement: HTMLInputElement): void {
    if (!this.isValidFileType(file)) {
      alert(
        'Tipo de arquivo não suportado. Use apenas imagens (JPG, PNG, GIF) ou vídeos (MP4, AVI, MOV).'
      );
      this.clearInput(inputElement);
      return;
    }

    this.selectedFile = file;
    this.fileType = this.getFileType(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.midiaPreview = reader.result as string;
      this.midiaSelected.emit(file);
    };

    reader.readAsDataURL(file);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputElement.files = dataTransfer.files;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  isPreviewImage(preview: string | ArrayBuffer): boolean {
    if (typeof preview !== 'string') return false;
    if (preview.startsWith('data:image/')) return true;
    if (preview.startsWith('http')) {
      // Verifica extensão de imagem
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(preview.split('?')[0]);
    }
    return false;
  }

  isPreviewVideo(preview: string | ArrayBuffer): boolean {
    if (typeof preview !== 'string') return false;
    if (preview.startsWith('data:video/')) return true;
    if (preview.startsWith('http')) {
      // Verifica extensão de vídeo
      return /\.(mp4|avi|mov|wmv|webm)$/i.test(preview.split('?')[0]);
    }
    return false;
  }

  private isValidFileType(file: File): boolean {
    const validImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const validVideoTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/webm',
    ];

    return (
      validImageTypes.includes(file.type) || validVideoTypes.includes(file.type)
    );
  }

  private getFileType(file: File): 'image' | 'video' {
    return file.type.startsWith('image/') ? 'image' : 'video';
  }

  private clearInput(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }

  removeFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.midiaPreview = null;
    this.selectedFile = null;
    this.fileType = null;

    const inputElement = document.getElementById(
      this.inputId
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }

    this.fileRemoved.emit();
    console.log('Arquivo removido');
  }

  getUploadIcon(): string {
    return 'assets/icones/image.svg';
  }

  getFileName(): string {
    return this.selectedFile ? this.selectedFile.name : '';
  }

  getFileSize(): string {
    if (!this.selectedFile) return '';

    const sizeInMB = this.selectedFile.size / (1024 * 1024);
    if (sizeInMB < 1) {
      return `${(this.selectedFile.size / 1024).toFixed(1)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  }
}
