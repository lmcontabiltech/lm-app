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
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';
import { Tarefa } from '../processos/tarefas';
import { Lista } from '../atividades/listas';

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
  lista: Tarefa[] = [];
  listasDeTarefas: Lista[] = [];
  novoNomeLista: string = '';
  modalAberto = false;

  selectedSetor: string = '';
  selectedStatus: string = '';
  selectedPrioridade: string = '';

  empresas: { value: string; description: string }[] = [];
  selectedEmpresa: string = '';
  membros: { value: string; description: string }[] = [];
  selectedMembro: string = '';
  processos: { value: string; description: string }[] = [];
  selectedProcesso: string = '';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private colaboradoresService: ColaboradoresService,
    private empresasService: EmpresasService,
    private processoService: ProcessoService
  ) {
    this.atividadeForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: [''],
      empresa: ['', Validators.required],
      setor: ['', Validators.required],
      processo: [''],
      dataInicio: [''],
      dataFim: [''],
      prioridade: ['', Validators.required],
      status: ['', Validators.required],
      membros: [[]],
      listas: [[]],
      novoNomeLista: [''],
    });
  }

  ngOnInit(): void {
    this.carregarEmpresas();
    this.carregarUsuarios();
    this.carregarProcessos();
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

  carregarUsuarios(): void {
    this.colaboradoresService.getUsuariosNonAdmin().subscribe(
      (usuarios) => {
        this.membros = usuarios.map((usuario) => ({
          value: usuario.id,
          description: usuario.nome,
        }));
      },
      (error) => {
        console.error('Erro ao carregar os usuários:', error);
      }
    );
  }

  carregarProcessos(): void {
    this.processoService.getProcessos().subscribe(
      (processos) => {
        this.processos = processos.map((processo) => ({
          value: processo.id,
          description: processo.nome,
        }));
      },
      (error) => {
        console.error('Erro ao carregar os processos:', error);
      }
    );
  }

  onSubmit(): void {
    const atividadeParaEnvio = {
      ...this.atividadeForm.value,
      listas: this.listasDeTarefas,
    };
    console.log('Listas a ser enviado:', atividadeParaEnvio);
    console.log('Membros selecionados:', this.selectedMembro);
    console.log('Atividade Form:', this.atividadeForm.value);
  }

  adicionarLista() {
    const nome = this.atividadeForm.get('novoNomeLista')?.value?.trim();
    if (!nome) return;

    const novaLista: Lista = {
      nome,
      itens: [],
    };
    this.listasDeTarefas.push(novaLista);
    console.log('Listas de tarefas:', this.listasDeTarefas);

    this.atividadeForm.get('novoNomeLista')?.setValue('');
  }

  removerLista(index: number) {
    this.listasDeTarefas.splice(index, 1);
  }

  abrirModalLista() {
    this.modalAberto = true;
    this.novoNomeLista = '';
  }

  fecharModalLista() {
    this.modalAberto = false;
  }
}
