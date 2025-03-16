import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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

  cadastroForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  colaboradorId: string | null = null;

  selectedSetor: string = '';
  permissao: string = 'USER';

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private colaboradoresService: ColaboradoresService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cadastroForm = this.formBuilder.group({
      confirmPassword: [''],
      email: ['', [Validators.required, Validators.email]],
      fotoKey: [''],
      fotoUrl: [''],
      nome: ['', Validators.required],
      password: ['', Validators.required],
      permissao: ['USER', Validators.required],
      setor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cadastroForm.get('setor')?.setValue(this.selectedSetor);
    this.colaboradorId = this.route.snapshot.paramMap.get('id');
    if (this.colaboradorId) {
      this.isEditMode = true;
      this.colaboradoresService.getUsuarioById(this.colaboradorId).subscribe(
        (usuario: Usuario) => {
          this.cadastroForm.patchValue(usuario);
          this.selectedSetor = usuario.setor || '';
        },
        (error) => {
          console.error('Erro ao carregar os dados do colaborador:', error);
        }
      );
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit(): void {
    console.log('Formulário enviado');
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.cadastroForm.get('setor')?.setValue(this.selectedSetor);

    const usuario: Usuario = {
      ...this.cadastroForm.value,
      setor: this.cadastroForm.get('setor')?.value || null,
      permissao: this.cadastroForm.get('permissao')?.value || null
    };
    console.log('Dados do usuário a serem enviados:', usuario);

    if (this.isEditMode && this.colaboradorId) {
      this.colaboradoresService.atualizarUsuario(this.colaboradorId, usuario).subscribe(
        response => {
          this.isLoading = false;
          this.successMessage = 'Usuário atualizado com sucesso!';
          this.errorMessage = null;
          this.router.navigate(['/usuario/colaboradores']);
          console.debug('Usuário atualizado com sucesso:', response);
        },
        error => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao atualizar usuário.';
          this.successMessage = null;
          console.error('Erro ao atualizar usuário:', error);
        }
      );
    } else {
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
}
