import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilialEmpresaComponent } from './filial-empresa.component';

describe('FilialEmpresaComponent', () => {
  let component: FilialEmpresaComponent;
  let fixture: ComponentFixture<FilialEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilialEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilialEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
