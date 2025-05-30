import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesFluxoComponent } from './detalhes-fluxo.component';

describe('DetalhesFluxoComponent', () => {
  let component: DetalhesFluxoComponent;
  let fixture: ComponentFixture<DetalhesFluxoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesFluxoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesFluxoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
