import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityReceiptComponent } from './commodity-receipt.component';

describe('CommodityReceiptComponent', () => {
  let component: CommodityReceiptComponent;
  let fixture: ComponentFixture<CommodityReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
