import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptHONumberPurchaseComponent } from './receipt-ho-number-purchase.component';

describe('ReceiptHONumberPurchaseComponent', () => {
  let component: ReceiptHONumberPurchaseComponent;
  let fixture: ComponentFixture<ReceiptHONumberPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptHONumberPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptHONumberPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
