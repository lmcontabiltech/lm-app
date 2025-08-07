import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
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

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private colaboradoresService: ColaboradoresService
  ) {
    this.noticiaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: [''],
      destinatario: [''],
    });
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
}
