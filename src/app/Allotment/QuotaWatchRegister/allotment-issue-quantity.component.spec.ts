import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentIssueQuantityComponent } from './allotment-issue-quantity.component';

describe('AllotmentIssueQuantityComponent', () => {
  let component: AllotmentIssueQuantityComponent;
  let fixture: ComponentFixture<AllotmentIssueQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotmentIssueQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotmentIssueQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
