import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    RouterModule,
  ],
  exports:[
    NavbarComponent
  ]
})
export class TemplateModule { }
