import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeReceiptComponent } from './scheme-receipt.component';

describe('SchemeReceiptComponent', () => {
  let component: SchemeReceiptComponent;
  let fixture: ComponentFixture<SchemeReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
