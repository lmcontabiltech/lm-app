import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelPrincipalComponent } from './painel-principal.component';

describe('PainelPrincipalComponent', () => {
  let component: PainelPrincipalComponent;
  let fixture: ComponentFixture<PainelPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
