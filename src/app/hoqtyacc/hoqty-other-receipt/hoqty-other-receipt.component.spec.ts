import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyOtherReceiptComponent } from './hoqty-other-receipt.component';

describe('HoqtyOtherReceiptComponent', () => {
  let component: HoqtyOtherReceiptComponent;
  let fixture: ComponentFixture<HoqtyOtherReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyOtherReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyOtherReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
