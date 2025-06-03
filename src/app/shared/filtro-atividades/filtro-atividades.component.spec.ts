import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroAtividadesComponent } from './filtro-atividades.component';

describe('FiltroAtividadesComponent', () => {
  let component: FiltroAtividadesComponent;
  let fixture: ComponentFixture<FiltroAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroAtividadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
