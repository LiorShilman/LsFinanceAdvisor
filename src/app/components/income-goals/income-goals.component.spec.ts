import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeGoalsComponent } from './income-goals.component';

describe('IncomeGoalsComponent', () => {
  let component: IncomeGoalsComponent;
  let fixture: ComponentFixture<IncomeGoalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeGoalsComponent]
    });
    fixture = TestBed.createComponent(IncomeGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
