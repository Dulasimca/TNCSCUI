import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOpeningBalanceToHOQtyComponent } from './transfer-opening-balance-to-hoqty.component';

describe('TransferOpeningBalanceToHOQtyComponent', () => {
  let component: TransferOpeningBalanceToHOQtyComponent;
  let fixture: ComponentFixture<TransferOpeningBalanceToHOQtyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferOpeningBalanceToHOQtyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOpeningBalanceToHOQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
