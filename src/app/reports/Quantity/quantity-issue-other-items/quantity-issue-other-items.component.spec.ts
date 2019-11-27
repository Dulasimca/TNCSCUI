import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityIssueOtherItemsComponent } from './quantity-issue-other-items.component';

describe('QuantityIssueOtherItemsComponent', () => {
  let component: QuantityIssueOtherItemsComponent;
  let fixture: ComponentFixture<QuantityIssueOtherItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityIssueOtherItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityIssueOtherItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
