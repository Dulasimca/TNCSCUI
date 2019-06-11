import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOrderRegisterComponent } from './delivery-order-register.component';

describe('DeliveryOrderRegisterComponent', () => {
  let component: DeliveryOrderRegisterComponent;
  let fixture: ComponentFixture<DeliveryOrderRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryOrderRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOrderRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
