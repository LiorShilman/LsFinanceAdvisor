import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentsComponent } from './commitments.component';

describe('CommitmentsComponent', () => {
  let component: CommitmentsComponent;
  let fixture: ComponentFixture<CommitmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommitmentsComponent]
    });
    fixture = TestBed.createComponent(CommitmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
