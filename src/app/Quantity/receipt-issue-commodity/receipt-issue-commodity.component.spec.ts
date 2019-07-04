import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptIssueCommodityComponent } from './receipt-issue-commodity.component';

describe('ReceiptIssueCommodityComponent', () => {
  let component: ReceiptIssueCommodityComponent;
  let fixture: ComponentFixture<ReceiptIssueCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptIssueCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptIssueCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
