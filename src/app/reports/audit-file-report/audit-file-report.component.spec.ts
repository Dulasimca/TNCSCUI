import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFileReportComponent } from './audit-file-report.component';

describe('AuditFileReportComponent', () => {
  let component: AuditFileReportComponent;
  let fixture: ComponentFixture<AuditFileReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditFileReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFileReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
