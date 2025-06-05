import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { TemplateModule } from './template/template.module';
import { LayoutComponent } from './layout/layout.component';
import { SistemaModule } from './sistema/sistema.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/token.interceptor';
import { ResetPasswordComponent } from './recuperar-senha/reset-password/reset-password.component';
import { EsqueciSenhaComponent } from './recuperar-senha/esqueci-senha/esqueci-senha.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    ResetPasswordComponent,
    EsqueciSenhaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TemplateModule,
    SistemaModule,
    SharedModule,
    FormsModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
