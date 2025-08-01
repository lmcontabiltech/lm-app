import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesPerifericoComponent } from './detalhes-periferico.component';

describe('DetalhesPerifericoComponent', () => {
  let component: DetalhesPerifericoComponent;
  let fixture: ComponentFixture<DetalhesPerifericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesPerifericoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesPerifericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
