import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopWiseAllotmentComponent } from './shop-wise-allotment.component';

describe('ShopWiseAllotmentComponent', () => {
  let component: ShopWiseAllotmentComponent;
  let fixture: ComponentFixture<ShopWiseAllotmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopWiseAllotmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopWiseAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
