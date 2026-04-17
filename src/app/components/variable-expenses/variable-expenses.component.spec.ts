import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableExpensesComponent } from './variable-expenses.component';

describe('VariableExpensesComponent', () => {
  let component: VariableExpensesComponent;
  let fixture: ComponentFixture<VariableExpensesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariableExpensesComponent]
    });
    fixture = TestBed.createComponent(VariableExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
