import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockpurchaseComponent } from './stockpurchase.component';

describe('StockpurchaseComponent', () => {
  let component: StockpurchaseComponent;
  let fixture: ComponentFixture<StockpurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockpurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
