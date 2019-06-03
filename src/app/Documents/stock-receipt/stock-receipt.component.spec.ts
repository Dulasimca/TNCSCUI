import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReceiptComponent } from './stock-receipt.component';

describe('StockReceiptComponent', () => {
  let component: StockReceiptComponent;
  let fixture: ComponentFixture<StockReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
