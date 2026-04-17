import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeInsuranceComponent } from './life-insurance.component';

describe('LifeInsuranceComponent', () => {
  let component: LifeInsuranceComponent;
  let fixture: ComponentFixture<LifeInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LifeInsuranceComponent]
    });
    fixture = TestBed.createComponent(LifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
