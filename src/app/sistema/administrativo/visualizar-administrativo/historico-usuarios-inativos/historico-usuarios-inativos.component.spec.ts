import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoUsuariosInativosComponent } from './historico-usuarios-inativos.component';

describe('HistoricoUsuariosInativosComponent', () => {
  let component: HistoricoUsuariosInativosComponent;
  let fixture: ComponentFixture<HistoricoUsuariosInativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoUsuariosInativosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoUsuariosInativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
