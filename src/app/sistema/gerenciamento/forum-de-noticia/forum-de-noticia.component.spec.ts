import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDeNoticiaComponent } from './forum-de-noticia.component';

describe('ForumDeNoticiaComponent', () => {
  let component: ForumDeNoticiaComponent;
  let fixture: ComponentFixture<ForumDeNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumDeNoticiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumDeNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
