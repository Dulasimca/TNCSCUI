import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptIssueOtherItemsComponent } from './quantity-issue-other-items.component';

describe('ReceiptIssueOtherItemsComponent', () => {
  let component: ReceiptIssueOtherItemsComponent;
  let fixture: ComponentFixture<ReceiptIssueOtherItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptIssueOtherItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptIssueOtherItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
