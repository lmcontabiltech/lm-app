import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoAtividadesComponent } from './historico-atividades.component';

describe('HistoricoAtividadesComponent', () => {
  let component: HistoricoAtividadesComponent;
  let fixture: ComponentFixture<HistoricoAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoAtividadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
