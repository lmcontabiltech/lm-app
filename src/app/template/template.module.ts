import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatMenuModule
  ],
  exports:[
    NavbarComponent
  ]
})
export class TemplateModule { }
