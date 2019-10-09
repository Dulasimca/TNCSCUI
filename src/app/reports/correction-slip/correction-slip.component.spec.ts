import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionSlipComponent } from './correction-slip.component';

describe('CorrectionSlipComponent', () => {
  let component: CorrectionSlipComponent;
  let fixture: ComponentFixture<CorrectionSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectionSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
