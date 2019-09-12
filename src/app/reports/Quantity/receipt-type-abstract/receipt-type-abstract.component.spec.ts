import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTypeAbstractComponent } from './receipt-type-abstract.component';

describe('ReceiptTypeAbstractComponent', () => {
  let component: ReceiptTypeAbstractComponent;
  let fixture: ComponentFixture<ReceiptTypeAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptTypeAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTypeAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
