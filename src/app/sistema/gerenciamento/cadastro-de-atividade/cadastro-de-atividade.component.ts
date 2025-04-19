import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { SetorDescricao } from '../../administrativo/cadastro-de-colaborador/setor-descricao';
import { Atividade } from '../atividades/atividades';
import { Prioridade } from '../atividades/enums/prioridade';
import { PrioridadeDescricao } from '../atividades/enums/prioridade-descricao';
import { Status } from '../atividades/enums/status';
import { StatusDescricao } from '../atividades/enums/status-descricao';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { EmpresasService } from 'src/app/services/empresas.service';

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

  status = Object.keys(Status).map((key) => ({
    value: Status[key as keyof typeof Status],
    description: StatusDescricao[Status[key as keyof typeof Status]],
  }));

  prioridades = Object.keys(Prioridade).map((key) => ({
    value: Prioridade[key as keyof typeof Prioridade],
    description:
      PrioridadeDescricao[Prioridade[key as keyof typeof Prioridade]],
  }));

  atividadeForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  atividadeId: string | null = null;

  selectedSetor: string = '';
  selectedStatus: string = '';
  selectedPrioridade: string = '';

  empresas: { value: string; description: string }[] = [];
  selectedEmpresa: string = '';

  valor: string[] = [
    'Alice Santos',
    'Bruno Oliveira',
    'Carla Mendes',
    'Diego Ferreira',
    'Elisa Costa',
    'Felipe Almeida',
    'Gabriela Rocha',
    'Henrique Souza',
    'Isabela Martins',
    'João Pereira',
  ];
  selectedMembro: string = '';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private colaboradoresService: ColaboradoresService,
    private empresasService: EmpresasService
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

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  goBack() {
    this.location.back();
  }

  carregarEmpresas(): void {
    this.empresasService.getEmpresas().subscribe(
      (empresas) => {
        this.empresas = empresas.map((empresa) => ({
          value: empresa.id,
          description: empresa.razaoSocial,
        }));
      },
      (error) => {
        console.error('Erro ao carregar as empresas:', error);
      }
    );
  }

  atualizarEmpresas(): void {
    console.log('Atualizando lista de lojas...');
    this.carregarEmpresas();
  }

  onSubmit(): void {}
}
