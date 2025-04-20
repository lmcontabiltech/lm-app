import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tarefa } from '../processos/tarefas';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { Escolha } from '../processos/enums/escolha';
import { EscolhaDescricao } from '../processos/enums/escolha-descricao';
import { Processo } from '../processos/processo';
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';

@Component({
  selector: 'app-cadastro-de-processos',
  templateUrl: './cadastro-de-processos.component.html',
  styleUrls: ['./cadastro-de-processos.component.css'],
})
export class CadastroDeProcessosComponent implements OnInit {
  subprocessos: Tarefa[] = [];
  processoForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  processoId: string | null = null;
  tipoDeProcesso: string = 'Fixo';

  setores = Object.keys(Setor).map((key) => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]],
  }));
  selectedSetor: string = '';
  selectedSetorDeDependencia: string = '';

  escolhas = Object.keys(Escolha).map((key) => ({
    value: Escolha[key as keyof typeof Escolha],
    description: EscolhaDescricao[Escolha[key as keyof typeof Escolha]],
  }));
  selectedDependeDeOutroSetor: string = '';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private processoService: ProcessoService
  ) {
    this.processoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      tipoDeProcesso: ['Fixo', Validators.required],
      setor: ['', Validators.required],
      dependeDeOutroSetor: [''],
      setorDeDependencia: [''],
      subprocessos: [[]],
    });
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.processoForm.invalid) {
      console.log('Estado do formulário:', this.processoForm);
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const processo: Processo = {
      ...this.processoForm.value,
    };
    console.log('Dados enviados para o backend:', processo);

    if (this.isEditMode && this.processoId) {
    } else {
      this.processoService.cadastrarProcesso(processo).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Processo cadastrado com sucesso!';
          this.errorMessage = null;
          // this.colaboradorForm.reset();
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erro ao cadastrar o processo.';
          this.successMessage = null;
        }
      );
    }
  }
}
