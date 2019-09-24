import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDetailCommodityComponent } from './receipt-detail-commodity.component';

describe('ReceiptDetailCommodityComponent', () => {
  let component: ReceiptDetailCommodityComponent;
  let fixture: ComponentFixture<ReceiptDetailCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptDetailCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptDetailCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
