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
import { Escolha } from '../processos/enums/escolha';
import { EscolhaDescricao } from '../processos/enums/escolha-descricao';
import { MULTAS_TIPO, MultaTipo } from '../atividades/enums/multa-tipo';

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

  escolha = Object.keys(Escolha).map((key) => ({
    value: Escolha[key as keyof typeof Escolha],
    description: EscolhaDescricao[Escolha[key as keyof typeof Escolha]],
  }));

  atividadeForm: FormGroup;
  tarefas: Tarefa[] = [];
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  atividadeId: string | null = null;

  selectedSetor: string = '';
  selectedStatus: string = '';
  selectedPrioridade: string = '';
  selectedPossuiProcesso: string = '';
  selectedPossuiMulta: string = '';

  empresas: { value: string; description: string }[] = [];
  selectedEmpresa: string = '';
  membros: { value: string; description: string }[] = [];
  selectedMembro: string = '';
  processos: { value: string; description: string }[] = [];
  selectedProcesso: string = '';
  multas: { value: string; description: string }[] = [];
  selectedMulta: string[] = [];

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
      idEmpresas: [[]],
      setor: [''],
      idProcesso: [{ value: '', disabled: true }],
      dataDeInicio: [''],
      dateDaEntrega: [''],
      prioridade: ['', Validators.required],
      status: ['', Validators.required],
      idsUsuario: [[]],
      subtarefas: [[{ id: 0, tarefa: '', checked: false }]],
      multa: [{ value: [], disabled: true }],
    });
  }

  ngOnInit(): void {
    this.carregarEmpresas();
    this.carregarUsuarios();
    this.carregarProcessos();
    this.verificarModoEdicao();
    this.carregarMultasPorSetor();
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

  carregarProcessos(setor?: string): void {
    if (setor) {
      this.processoService.getProcessosBySetores([setor]).subscribe(
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
    } else {
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
  }

  onSubmit(): void {
    const atividade: Atividade = {
      ...this.atividadeForm.value,
      idsUsuario: this.atividadeForm.value.idsUsuario,
      multa: this.atividadeForm.value.multa,
      idEmpresas: this.atividadeForm.value.idEmpresas,
    };

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

  onMembrosChange(event: any) {
    const ids = Array.isArray(event)
      ? event.map((item: any) => item.value)
      : [];
    this.atividadeForm.get('idsUsuario')?.setValue(ids);
    console.log('Membros selecionados (ids):', ids);
  }

  onMultaChange(val: any[]) {
    this.selectedMulta = val;
    const values = Array.isArray(val) ? val.map((item: any) => item.value) : [];
    this.atividadeForm.get('multa')?.setValue(values);
    console.log('Multas selecionadas (values):', values);
  }

  onEmpresasChange(event: any) {
    const values = Array.isArray(event)
      ? event.map((item: any) => item.value)
      : [];
    this.atividadeForm.get('idEmpresas')?.setValue(values);
    console.log('Empresas selecionadas (values):', values);
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

  onSetorChange(setor: string) {
    this.selectedSetor = setor;
    this.carregarMultasPorSetor(setor);
    this.carregarProcessos(setor);
  }

  carregarMultasPorSetor(setor?: string): void {
    let multasFiltradas: MultaTipo[];
    if (setor) {
      multasFiltradas = MULTAS_TIPO.filter((multa) => multa.setor === setor);
    } else {
      multasFiltradas = MULTAS_TIPO;
    }
    this.multas = multasFiltradas.map((multa) => ({
      value: multa.key,
      description: multa.descricao,
    }));
  }

  onDependenciaChange(
    controlName: string,
    dependentControlName: string,
    value: string | null
  ): void {
    const dependentControl = this.atividadeForm.get(dependentControlName);

    if (value === 'Sim') {
      dependentControl?.enable();
    } else {
      dependentControl?.disable();
      if (Array.isArray(dependentControl?.value)) {
        dependentControl?.setValue([]);
      } else {
        dependentControl?.setValue('');
      }
    }
  }

  onProcessoSelecionado(event: any) {
    // Se o evento for objeto, pegue o value; senão, use o próprio evento
    const processoId = event?.value ?? event;
    console.log('ID do processo selecionado:', processoId);

    if (!processoId || processoId === 'Sim' || processoId === 'Não') {
      this.atividadeForm.get('nome')?.enable();
      this.atividadeForm.get('subtarefas')?.enable();
      this.atividadeForm.patchValue({ nome: '', subtarefas: [] });
      return;
    }

    this.processoService.getProcessoById(processoId).subscribe((processo) => {
      this.atividadeForm.patchValue({
        nome: processo.nome,
        subtarefas: processo.subprocessos,
      });
      this.atividadeForm.get('nome')?.enable();
      this.atividadeForm.get('subtarefas')?.enable();
    });
  }
}
