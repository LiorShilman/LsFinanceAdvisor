import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOffFamilyGoalsComponent } from './one-off-family-goals.component';

describe('OneOffFamilyGoalsComponent', () => {
  let component: OneOffFamilyGoalsComponent;
  let fixture: ComponentFixture<OneOffFamilyGoalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneOffFamilyGoalsComponent]
    });
    fixture = TestBed.createComponent(OneOffFamilyGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
