import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardColaboradorComponent } from './dashboard-colaborador.component';

describe('DashboardColaboradorComponent', () => {
  let component: DashboardColaboradorComponent;
  let fixture: ComponentFixture<DashboardColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardColaboradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
