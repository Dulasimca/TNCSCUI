import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckReceiptComponent } from './truck-receipt.component';

describe('TruckReceiptComponent', () => {
  let component: TruckReceiptComponent;
  let fixture: ComponentFixture<TruckReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
