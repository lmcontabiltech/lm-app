import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesScannerComponent } from './detalhes-scanner.component';

describe('DetalhesScannerComponent', () => {
  let component: DetalhesScannerComponent;
  let fixture: ComponentFixture<DetalhesScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesScannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
