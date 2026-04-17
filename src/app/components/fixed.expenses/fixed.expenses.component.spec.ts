import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedExpensesComponent } from './fixed.expenses.component';

describe('ExpensesComponent', () => {
  let component: FixedExpensesComponent;
  let fixture: ComponentFixture<FixedExpensesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixedExpensesComponent]
    });
    fixture = TestBed.createComponent(FixedExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
