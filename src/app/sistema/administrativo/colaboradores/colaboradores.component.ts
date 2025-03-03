import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  cadastrarColaborador(): void {
    this.router.navigate(['/usuario/cadastro-de-colaborador']); 
  }

}
