import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoBarraVerticalComponent } from './grafico-barra-vertical.component';

describe('GraficoBarraVerticalComponent', () => {
  let component: GraficoBarraVerticalComponent;
  let fixture: ComponentFixture<GraficoBarraVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoBarraVerticalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoBarraVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
