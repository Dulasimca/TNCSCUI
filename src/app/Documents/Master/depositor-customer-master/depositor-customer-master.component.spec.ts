import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositorCustomerMasterComponent } from './depositor-customer-master.component';

describe('DepositorCustomerMasterComponent', () => {
  let component: DepositorCustomerMasterComponent;
  let fixture: ComponentFixture<DepositorCustomerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositorCustomerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositorCustomerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
