import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReceiptRegisterComponent } from './stock-receipt-register.component';

describe('StockReceiptRegisterComponent', () => {
  let component: StockReceiptRegisterComponent;
  let fixture: ComponentFixture<StockReceiptRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiptRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiptRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
