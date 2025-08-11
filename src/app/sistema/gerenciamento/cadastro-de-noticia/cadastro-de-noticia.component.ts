import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Noticia } from '../forum-de-noticia/noticia';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { NoticiaService } from 'src/app/services/gerenciamento/noticia.service';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';

@Component({
  selector: 'app-cadastro-de-noticia',
  templateUrl: './cadastro-de-noticia.component.html',
  styleUrls: ['./cadastro-de-noticia.component.css'],
})
export class CadastroDeNoticiaComponent implements OnInit {
  noticiaForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  noticiaId: string | null = null;

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));
  selectedSetor: string = '';

  arquivo: File | { documentoUrl: string; id: number; name: string } | null =
    null;
  selectedFile: File | null = null;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private noticiaService: NoticiaService,
    private colaboradoresService: ColaboradoresService
  ) {
    this.noticiaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      conteudo: [''],
    });
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.noticiaForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const noticia: Noticia = {
      ...this.noticiaForm.value,
    };

    const formData = new FormData();
    formData.append('noticia', JSON.stringify(noticia));

    if (this.selectedFile) {
      formData.append('arquivo', this.selectedFile);
    }

    if (this.isEditMode && this.noticiaId) {
      this.noticiaService
        .editarNoticia(Number(this.noticiaId), formData)
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.successMessage = 'Notícia atualizada com sucesso!';
            this.errorMessage = null;
            this.noticiaForm.reset();
            this.router.navigate(['/usuario/forum-de-noticias'], {
              state: { successMessage: 'Notícia atualizada com sucesso!' },
            });
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Erro ao atualizar a notícia.';
            this.successMessage = null;
          }
        );
    } else {
      this.noticiaService.cadastrarNoticia(formData).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Notícia cadastrada com sucesso!';
          this.errorMessage = null;
          this.noticiaForm.reset();
          this.router.navigate(['/usuario/forum-de-noticias'], {
            state: { successMessage: 'Notícia cadastrada com sucesso!' },
          });
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erro ao cadastrar a notícia.';
          this.successMessage = null;
        }
      );
    }
  }

  isRequired(controlName: string): boolean {
    const control = this.noticiaForm.get(controlName);
    if (control && control.validator) {
      const validator = control.validator({} as AbstractControl);
      return !!(validator && validator['required']);
    }
    return false;
  }

  onArquivoSelecionado(arquivo: File | null): void {
    if (arquivo) {
      console.log('📎 Arquivo selecionado:', arquivo.name);
      console.log('📊 Tamanho:', arquivo.size);
      console.log('🎭 Tipo:', arquivo.type);
      this.selectedFile = arquivo;
    }
  }

  onArquivoRemovido(): void {
    console.log('🗑️ Arquivo removido');
    this.selectedFile = null;
  }

  private verificarModoEdicao(): void {
    this.noticiaId = this.route.snapshot.paramMap.get('id');
    if (this.noticiaId) {
      this.isEditMode = true;
      this.noticiaService.getNoticiaById(Number(this.noticiaId)).subscribe(
        (noticia: Noticia) => {
          this.noticiaForm.patchValue({
            ...noticia,
          });

          if (noticia.arquivo) {
            this.selectedFile = null;
            this.arquivo = noticia.arquivo;
          }
        },
        (error) => {
          console.error('Erro ao carregar os dados de notícia', error);
          this.errorMessage = 'Erro ao carregar os dados da notícia.';
        }
      );
    }
  }
}
