import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Setor } from './setor';
import { SetorDescricao } from './setor-descricao';
import { ColaboradoresService } from '../../../services/colaboradores.service';
import { Usuario } from "../../../login/usuario"; 

@Component({
  selector: 'app-cadastro-de-colaborador',
  templateUrl: './cadastro-de-colaborador.component.html',
  styleUrls: ['./cadastro-de-colaborador.component.css']
})
export class CadastroDeColaboradorComponent implements OnInit {
  setores = Object.keys(Setor).map(key => ({
    value: Setor[key as keyof typeof Setor],
    description: SetorDescricao[Setor[key as keyof typeof Setor]]
  }));

  // selectedSetor: string = '';
  cadastroForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  get selectedSetor(): string {
    return this.cadastroForm.get('setor')?.value;
  }
  
  set selectedSetor(value: string) {
    this.cadastroForm.get('setor')?.setValue(value);
  }

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private colaboradoresService: ColaboradoresService
  ) {}

  private initForm(): void {
    this.cadastroForm = this.formBuilder.group({
      id: [''],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nome: ['', Validators.required],
      password: ['', Validators.required],
      setor: ['', Validators.required],
      permissao: [''],
      fotoKey: [''],
      fotoUrl: [''],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.errorMessage = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }

    console.log('Formulário enviado');
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.cadastroForm.get('setor')?.setValue(this.selectedSetor);

    const usuario: Usuario = this.cadastroForm.value;
    console.log('Dados do usuário a serem enviados:', usuario);

    this.colaboradoresService.cadastrarUsuario(usuario).subscribe(
      response => {
        this.isLoading = false;
        this.successMessage = 'Usuário cadastrado com sucesso!';
        this.errorMessage = null;
        this.cadastroForm.reset();
        console.debug('Usuário cadastrado com sucesso:', response);
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao cadastrar usuário.';
        this.successMessage = null;
        console.error('Erro ao cadastrar usuário:', error);
      }
    );
  }
}
