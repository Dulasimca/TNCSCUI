import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CashReceiptRegisterComponent } from './Cash-Receipt-Register.component';


describe('CashReceiptRegisterComponent', () => {
  let component: CashReceiptRegisterComponent;
  let fixture: ComponentFixture<CashReceiptRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashReceiptRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashReceiptRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
