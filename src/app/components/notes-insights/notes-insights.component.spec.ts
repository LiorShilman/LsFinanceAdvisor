import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesInsightsComponent } from './notes-insights.component';

describe('NotesInsightsComponent', () => {
  let component: NotesInsightsComponent;
  let fixture: ComponentFixture<NotesInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesInsightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotesInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
