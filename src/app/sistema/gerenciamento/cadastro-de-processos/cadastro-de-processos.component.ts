import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cadastro-de-processos',
  templateUrl: './cadastro-de-processos.component.html',
  styleUrls: ['./cadastro-de-processos.component.css'],
})
export class CadastroDeProcessosComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
}
