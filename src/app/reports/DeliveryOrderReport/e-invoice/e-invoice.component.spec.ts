import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceComponent } from './e-invoice.component';

describe('EInvoiceComponent', () => {
  let component: EInvoiceComponent;
  let fixture: ComponentFixture<EInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
