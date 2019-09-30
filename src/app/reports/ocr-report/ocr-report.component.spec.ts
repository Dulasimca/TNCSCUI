import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OCRReportComponent } from './ocr-report.component';

describe('OCRReportComponent', () => {
  let component: OCRReportComponent;
  let fixture: ComponentFixture<OCRReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OCRReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OCRReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
