import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptRONOPurchaseComponent } from './receipt-rono-purchase.component';

describe('ReceiptRONOPurchaseComponent', () => {
  let component: ReceiptRONOPurchaseComponent;
  let fixture: ComponentFixture<ReceiptRONOPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptRONOPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptRONOPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
