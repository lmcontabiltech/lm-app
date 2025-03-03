import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDeNoticiasComponent } from './forum-de-noticias.component';

describe('ForumDeNoticiasComponent', () => {
  let component: ForumDeNoticiasComponent;
  let fixture: ComponentFixture<ForumDeNoticiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumDeNoticiasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForumDeNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
