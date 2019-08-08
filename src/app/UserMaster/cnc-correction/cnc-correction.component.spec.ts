import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CncCorrectionComponent } from './cnc-correction.component';

describe('CncCorrectionComponent', () => {
  let component: CncCorrectionComponent;
  let fixture: ComponentFixture<CncCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CncCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CncCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
