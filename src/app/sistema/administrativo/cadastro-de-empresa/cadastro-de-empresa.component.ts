import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cadastro-de-empresa',
  templateUrl: './cadastro-de-empresa.component.html',
  styleUrls: ['./cadastro-de-empresa.component.css']
})
export class CadastroDeEmpresaComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

}
