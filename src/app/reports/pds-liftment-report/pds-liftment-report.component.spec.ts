import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdsLiftmentReportComponent } from './pds-liftment-report.component';

describe('PdsLiftmentReportComponent', () => {
  let component: PdsLiftmentReportComponent;
  let fixture: ComponentFixture<PdsLiftmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdsLiftmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdsLiftmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
