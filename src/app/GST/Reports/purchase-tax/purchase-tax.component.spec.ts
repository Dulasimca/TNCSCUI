import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTaxComponent } from './purchase-tax.component';

describe('PurchaseTaxComponent', () => {
  let component: PurchaseTaxComponent;
  let fixture: ComponentFixture<PurchaseTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
