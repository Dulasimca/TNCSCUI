import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxAbstractpurchaseComponent } from './tax-abstractpurchase.component';

describe('TaxAbstractpurchaseComponent', () => {
  let component: TaxAbstractpurchaseComponent;
  let fixture: ComponentFixture<TaxAbstractpurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxAbstractpurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxAbstractpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
