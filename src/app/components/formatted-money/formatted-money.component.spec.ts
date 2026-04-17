import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedMoneyComponent } from './formatted-money.component';

describe('FormattedMoneyComponent', () => {
  let component: FormattedMoneyComponent;
  let fixture: ComponentFixture<FormattedMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormattedMoneyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormattedMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
