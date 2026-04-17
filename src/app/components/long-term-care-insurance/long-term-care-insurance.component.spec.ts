import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermCareInsuranceComponent } from './long-term-care-insurance.component';

describe('LongTermCareInsuranceComponent', () => {
  let component: LongTermCareInsuranceComponent;
  let fixture: ComponentFixture<LongTermCareInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LongTermCareInsuranceComponent]
    });
    fixture = TestBed.createComponent(LongTermCareInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
