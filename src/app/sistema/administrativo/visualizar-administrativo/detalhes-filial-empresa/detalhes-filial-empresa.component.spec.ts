import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesFilialEmpresaComponent } from './detalhes-filial-empresa.component';

describe('DetalhesFilialEmpresaComponent', () => {
  let component: DetalhesFilialEmpresaComponent;
  let fixture: ComponentFixture<DetalhesFilialEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesFilialEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesFilialEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
