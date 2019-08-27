import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DDChequeEntryComponent } from './DD-cheque-entry.component';

describe('DDChequeEntryComponent', () => {
  let component: DDChequeEntryComponent;
  let fixture: ComponentFixture<DDChequeEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DDChequeEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DDChequeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
