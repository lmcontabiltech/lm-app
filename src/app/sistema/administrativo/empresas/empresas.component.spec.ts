import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasComponent } from './empresas.component';

describe('EmpresasComponent', () => {
  let component: EmpresasComponent;
  let fixture: ComponentFixture<EmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
