import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Setor } from './setor';
import { SetorDescricao } from './setor-descricao';

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

  selectedSetor: string = '';
  nome: string = '';
  email: string = '';
  senha: string = '';

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    console.log('Form Data:', {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      selectedSetor: this.selectedSetor
    });
  }
}
