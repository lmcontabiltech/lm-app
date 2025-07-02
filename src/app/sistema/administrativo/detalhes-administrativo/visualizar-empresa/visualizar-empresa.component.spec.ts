import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEmpresaComponent } from './visualizar-empresa.component';

describe('VisualizarEmpresaComponent', () => {
  let component: VisualizarEmpresaComponent;
  let fixture: ComponentFixture<VisualizarEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
