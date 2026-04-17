import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInsuranceComponent } from './health-insurance.component';

describe('HealthInsuranceComponent', () => {
  let component: HealthInsuranceComponent;
  let fixture: ComponentFixture<HealthInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HealthInsuranceComponent]
    });
    fixture = TestBed.createComponent(HealthInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
