import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoToSalesTaxComponent } from './do-to-sales-tax.component';

describe('DoToSalesTaxComponent', () => {
  let component: DoToSalesTaxComponent;
  let fixture: ComponentFixture<DoToSalesTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoToSalesTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoToSalesTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
