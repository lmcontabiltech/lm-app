import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPerifericoComponent } from './visualizar-periferico.component';

describe('VisualizarPerifericoComponent', () => {
  let component: VisualizarPerifericoComponent;
  let fixture: ComponentFixture<VisualizarPerifericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarPerifericoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarPerifericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
