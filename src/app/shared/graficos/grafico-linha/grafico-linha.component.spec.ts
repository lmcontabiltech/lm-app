import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoLinhaComponent } from './grafico-linha.component';

describe('GraficoLinhaComponent', () => {
  let component: GraficoLinhaComponent;
  let fixture: ComponentFixture<GraficoLinhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoLinhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoLinhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
