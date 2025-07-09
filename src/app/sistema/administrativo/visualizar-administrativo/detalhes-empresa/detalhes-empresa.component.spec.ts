import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesEmpresaComponent } from './detalhes-empresa.component';

describe('DetalhesEmpresaComponent', () => {
  let component: DetalhesEmpresaComponent;
  let fixture: ComponentFixture<DetalhesEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
