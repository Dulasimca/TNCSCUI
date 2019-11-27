import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityDetailCommodityComponent } from './quantity-detail-commodity.component';

describe('QuantityDetailCommodityComponent', () => {
  let component: QuantityDetailCommodityComponent;
  let fixture: ComponentFixture<QuantityDetailCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityDetailCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityDetailCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
