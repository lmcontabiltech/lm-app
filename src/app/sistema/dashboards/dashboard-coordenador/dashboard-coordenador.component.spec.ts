import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCoordenadorComponent } from './dashboard-coordenador.component';

describe('DashboardCoordenadorComponent', () => {
  let component: DashboardCoordenadorComponent;
  let fixture: ComponentFixture<DashboardCoordenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCoordenadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCoordenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
