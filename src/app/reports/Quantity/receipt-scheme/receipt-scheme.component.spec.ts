import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSchemeComponent } from './receipt-scheme.component';

describe('ReceiptSchemeComponent', () => {
  let component: ReceiptSchemeComponent;
  let fixture: ComponentFixture<ReceiptSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
