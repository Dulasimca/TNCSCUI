import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCommodityComponent } from './stock-commodity.component';

describe('StockCommodityComponent', () => {
  let component: StockCommodityComponent;
  let fixture: ComponentFixture<StockCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
