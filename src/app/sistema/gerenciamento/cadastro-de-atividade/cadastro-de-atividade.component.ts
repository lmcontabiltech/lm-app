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
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { EmpresasService } from 'src/app/services/administrativo/empresas.service';
import { ProcessoService } from 'src/app/services/gerenciamento/processo.service';
import { Tarefa } from '../processos/tarefas';
import { Lista } from '../atividades/listas';
import { AtividadeService } from 'src/app/services/gerenciamento/atividade.service';

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
    private processoService: ProcessoService,
    private atividadeService: AtividadeService
  ) {
    this.atividadeForm = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: [''],
      idEmpresa: [''],
      setor: [''],
      idProcesso: [''],
      dataDeInicio: [''],
      dateDaEntrega: [''],
      prioridade: ['', Validators.required],
      status: ['', Validators.required],
      idsUsuario: [[]],
      tarefas: [[]],
      novoNomeLista: [''],
    });
  }

  ngOnInit(): void {
    this.carregarEmpresas();
    this.carregarUsuarios();
    this.carregarProcessos();
    this.verificarModoEdicao();
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
    console.log('Atualizando lista de empresas...');
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
    console.log('Listas de tarefas antes do submit:', this.listasDeTarefas);
    // Remover novoNomeLista do envio
    const { novoNomeLista, tarefas, ...formValues } = this.atividadeForm.value;

    const atividade: Atividade = {
      ...this.atividadeForm.value,
      idsUsuario: this.atividadeForm.value.idsUsuario,
      tarefas: this.listasDeTarefas,
    };
    console.log('Listas a ser enviado:', atividade);
    console.log('Atividade Form:', this.atividadeForm.value);

    if (this.isEditMode && this.atividadeId) {
      this.atividadeService
        .atualizarAtividade(this.atividadeId, atividade)
        .subscribe(
          (response) => {
            this.isLoading = false;
            this.successMessage = 'Atividade atualizada com sucesso!';
            this.errorMessage = null;
            this.router.navigate(['/usuario/atividades']);
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage =
              error.message || 'Erro ao atualizar a atividade.';
            this.successMessage = null;
          }
        );
    } else {
      this.atividadeService.cadastrarAtividade(atividade).subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = 'Atividade cadastrado com sucesso!';
          this.errorMessage = null;
          this.atividadeForm.reset();
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erro ao cadastrar a atividade.';
          this.successMessage = null;
        }
      );
    }
  }

  adicionarLista() {
    const nome = this.atividadeForm.get('novoNomeLista')?.value?.trim();
    if (!nome) return;

    const novaLista: Lista = {
      nome,
      subtarefas: [],
    };
    this.listasDeTarefas.push(novaLista);
    console.log('Listas de tarefas:', this.listasDeTarefas);

    this.atividadeForm.get('novoNomeLista')?.setValue('');
    this.fecharModalLista();
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

  onMembrosChange(event: any) {
    const ids = Array.isArray(event)
      ? event.map((item: any) => item.value)
      : [];
    this.atividadeForm.get('idsUsuario')?.setValue(ids);
    console.log('Membros selecionados (ids):', ids);
  }

  private verificarModoEdicao(): void {
    this.atividadeId = this.route.snapshot.paramMap.get('id');
    if (this.atividadeId) {
      this.isEditMode = true;
      this.carregarDadosAtividade(this.atividadeId);
    }
  }

  private carregarDadosAtividade(atividadeId: string): void {
    this.atividadeService.getAtividadeById(atividadeId).subscribe(
      (atividade: Atividade) => {
        console.log('Dados da atividade recebidos:', atividade);

        this.atividadeForm.patchValue({
          ...atividade,
        });

        this.tratarDadosAtividade(atividade);

        // Se tiver listas de tarefas
        if (atividade.tarefas) {
          this.listasDeTarefas = atividade.tarefas;
        }
      },
      (error) => {
        console.error('Erro ao carregar os dados da atividade:', error);
      }
    );
  }

  private tratarDadosAtividade(atividade: Atividade): void {
    // Empresa
    if (atividade.empresa) {
      this.selectedEmpresa = atividade.empresa.id;
      this.empresas = [
        {
          value: atividade.empresa.id,
          description: atividade.empresa.razaoSocial,
        },
      ];
    }

    // Processo
    if (atividade.processo) {
      this.selectedProcesso = atividade.processo.id;
      this.processos = [
        {
          value: atividade.processo.id,
          description: atividade.processo.nome,
        },
      ];
    }

    // Status
    this.selectedStatus = atividade.status || '';
    // Setor
    this.selectedSetor = atividade.setor || '';
    // Prioridade
    this.selectedPrioridade = atividade.prioridade || '';
  }
}
