import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityDetailIssueComponent } from './quantity-detail-issue.component';

describe('QuantityDetailIssueComponent', () => {
  let component: QuantityDetailIssueComponent;
  let fixture: ComponentFixture<QuantityDetailIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityDetailIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityDetailIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
