import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackReceiptEntryComponent } from './stack-receipt-entry.component';

describe('StackReceiptEntryComponent', () => {
  let component: StackReceiptEntryComponent;
  let fixture: ComponentFixture<StackReceiptEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackReceiptEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackReceiptEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
