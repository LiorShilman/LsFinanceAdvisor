import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepetitiveGoalsComponent } from './repetitive-goals.component';

describe('RepetitiveGoalsComponent', () => {
  let component: RepetitiveGoalsComponent;
  let fixture: ComponentFixture<RepetitiveGoalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepetitiveGoalsComponent]
    });
    fixture = TestBed.createComponent(RepetitiveGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
