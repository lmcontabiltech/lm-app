import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-input-word',
  templateUrl: './input-word.component.html',
  styleUrls: ['./input-word.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputWordComponent),
      multi: true,
    },
  ],
})
export class InputWordComponent implements OnInit {
  @ViewChild('editor', { static: true }) editorElement!: ElementRef;
  @Input() placeholder: string = 'Digite seu texto aqui...';
  @Input() height: string = '200px';
  @Input() readonly: boolean = false;
  @Output() contentChange = new EventEmitter<string>();

  private quill!: Quill;
  private onChange = (value: string) => {};
  private onTouched = () => {};

  editorContent: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.initializeQuill();
  }

  private initializeQuill(): void {
    const config = {
      theme: 'snow',
      placeholder: this.placeholder,
      readOnly: this.readonly,
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        },
      },
    };

    this.quill = new Quill(this.editorElement.nativeElement, config);
    this.editorElement.nativeElement.style.height = this.height;

    // Listener para mudanças no conteúdo
    this.quill.on('text-change', () => {
      const content = this.quill.root.innerHTML;
      this.editorContent = content;
      this.onChange(content);
      this.contentChange.emit(content);
    });

    this.quill.on('selection-change', (range, oldRange, source) => {
      if (range === null && oldRange !== null) {
        this.onTouched();
      }
    });
  }

  writeValue(value: string): void {
    if (this.quill) {
      if (value) {
        this.quill.root.innerHTML = value;
      } else {
        this.quill.setText('');
      }
    }
    this.editorContent = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }

  getContent(): string {
    return this.quill ? this.quill.root.innerHTML : '';
  }

  getText(): string {
    return this.quill ? this.quill.getText() : '';
  }

  clear(): void {
    if (this.quill) {
      this.quill.setText('');
    }
  }

  focus(): void {
    if (this.quill) {
      this.quill.focus();
    }
  }
}
