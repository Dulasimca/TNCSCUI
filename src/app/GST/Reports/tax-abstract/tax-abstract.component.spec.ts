import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxAbstractComponent } from './tax-abstract.component';

describe('TaxAbstractComponent', () => {
  let component: TaxAbstractComponent;
  let fixture: ComponentFixture<TaxAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
