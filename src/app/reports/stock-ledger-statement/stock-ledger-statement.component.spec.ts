import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLedgerStatementComponent } from './stock-ledger-statement.component';

describe('StockLedgerStatementComponent', () => {
  let component: StockLedgerStatementComponent;
  let fixture: ComponentFixture<StockLedgerStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockLedgerStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockLedgerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
