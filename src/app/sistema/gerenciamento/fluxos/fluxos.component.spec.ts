import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxosComponent } from './fluxos.component';

describe('FluxosComponent', () => {
  let component: FluxosComponent;
  let fixture: ComponentFixture<FluxosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FluxosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluxosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
