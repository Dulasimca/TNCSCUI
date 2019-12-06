import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyLedgerUpdateComponent } from './party-ledger-update.component';

describe('PartyLedgerUpdateComponent', () => {
  let component: PartyLedgerUpdateComponent;
  let fixture: ComponentFixture<PartyLedgerUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyLedgerUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyLedgerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
