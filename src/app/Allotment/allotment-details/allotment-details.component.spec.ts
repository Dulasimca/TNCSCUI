import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentDetailsComponent } from './allotment-details.component';

describe('AllotmentDetailsComponent', () => {
  let component: AllotmentDetailsComponent;
  let fixture: ComponentFixture<AllotmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
