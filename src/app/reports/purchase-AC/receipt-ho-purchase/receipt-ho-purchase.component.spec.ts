import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptHOPurchaseComponent } from './receipt-ho-purchase.component';

describe('ReceiptHoPurchaseComponent', () => {
  let component: ReceiptHOPurchaseComponent;
  let fixture: ComponentFixture<ReceiptHOPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptHOPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptHOPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
