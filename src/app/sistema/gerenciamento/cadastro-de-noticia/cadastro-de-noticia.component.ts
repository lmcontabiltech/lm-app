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
import { TipoNoticia } from '../forum-de-noticia/enums/tipo-noticia';
import { TipoNoticiaDescricao } from '../forum-de-noticia/enums/tipo-noticia-descricao';

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
  selectedSetor: { value: string; description: string }[] = [];

  arquivo: File | { documentoUrl: string; id: number; name: string } | null =
    null;
  selectedFile: File | null = null;

  tiposNoticia = Object.keys(TipoNoticia).map((key) => ({
    value: TipoNoticia[key as keyof typeof TipoNoticia],
    description:
      TipoNoticiaDescricao[TipoNoticia[key as keyof typeof TipoNoticia]],
  }));
  selectedTipoNoticia: string = '';

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
      conteudo: ['', Validators.required],
      tipoNoticia: ['', Validators.required],
      setores: [[]],
    });
  }

  ngOnInit(): void {
    this.verificarModoEdicao();
  }

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
      setores: (this.noticiaForm.value.setores || []).map(
        (s: any) => s.value || s
      ),
    };

    const formData = new FormData();
    formData.append('dados', JSON.stringify(noticia));

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
            this.router.navigate(['/usuario/central-de-noticias'], {
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
          this.router.navigate(['/usuario/central-de-noticias'], {
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

  onSetoresChange(setoresSelecionados: any[]) {
    this.noticiaForm.get('setores')?.setValue(setoresSelecionados);
  }

  private verificarModoEdicao(): void {
    this.noticiaId = this.route.snapshot.paramMap.get('id');
    if (this.noticiaId) {
      this.isEditMode = true;
      this.noticiaService.getNoticiaById(Number(this.noticiaId)).subscribe(
        (noticia: Noticia) => {
          const setoresSelecionados = (noticia.setores || []).map(
            (setor: string) => {
              const found = this.setores.find((opt) => opt.value === setor);
              return found ? found : { value: setor, description: setor };
            }
          );

          this.selectedTipoNoticia = noticia.tipoNoticia || '';
          this.noticiaForm.patchValue({
            ...noticia,
            setores: setoresSelecionados,
            tipoNoticia: noticia.tipoNoticia || '',
          });

          if (noticia.arquivo) {
            this.selectedFile = null;
            this.arquivo = noticia.arquivo;
          }

          this.selectedSetor = setoresSelecionados;
        },
        (error) => {
          console.error('Erro ao carregar os dados de notícia', error);
          this.errorMessage = 'Erro ao carregar os dados da notícia.';
        }
      );
    }
  }
}
