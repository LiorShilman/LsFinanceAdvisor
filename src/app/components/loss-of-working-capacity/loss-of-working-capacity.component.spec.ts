import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossOfWorkingCapacityComponent } from './loss-of-working-capacity.component';

describe('LossOfWorkingCapacityComponent', () => {
  let component: LossOfWorkingCapacityComponent;
  let fixture: ComponentFixture<LossOfWorkingCapacityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LossOfWorkingCapacityComponent]
    });
    fixture = TestBed.createComponent(LossOfWorkingCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
