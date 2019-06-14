import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptROPurchaseComponent } from './receipt-ro-purchase.component';

describe('ReceiptROPurchaseComponent', () => {
  let component: ReceiptROPurchaseComponent;
  let fixture: ComponentFixture<ReceiptROPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptROPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptROPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
