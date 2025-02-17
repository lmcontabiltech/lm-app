import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(): void {
  
    if (this.username && this.password) {
    
      this.router.navigate(['/usuario/painel-principal']);
    } else {
      alert('Por favor, preencha os campos corretamente.');
    }
  }

}
