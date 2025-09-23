import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoScannerComponent } from './historico-scanner.component';

describe('HistoricoScannerComponent', () => {
  let component: HistoricoScannerComponent;
  let fixture: ComponentFixture<HistoricoScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoScannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
