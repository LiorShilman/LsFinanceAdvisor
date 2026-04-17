import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedDataComponent } from './calculated-data.component';

describe('CalculatedDataComponent', () => {
  let component: CalculatedDataComponent;
  let fixture: ComponentFixture<CalculatedDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatedDataComponent]
    });
    fixture = TestBed.createComponent(CalculatedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
