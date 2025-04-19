import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { Atividade } from '../atividades/atividades';
import { Prioridade } from '../atividades/prioridade';

@Component({
  selector: 'app-cadastro-de-atividade',
  templateUrl: './cadastro-de-atividade.component.html',
  styleUrls: ['./cadastro-de-atividade.component.css'],
})
export class CadastroDeAtividadeComponent implements OnInit {
  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));

  atividadeForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  atividadeId: string | null = null;

  selectedSetor: string = '';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.atividadeForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: [''],
      setor: ['', Validators.required],
      processo: [''],
      dataInicio: [''],
      dataFim: [''],
      prioridade: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  onSubmit(): void {}
}
