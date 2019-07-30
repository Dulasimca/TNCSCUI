import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDocumentIssueComponent } from './daily-document-issue.component';

describe('DailyDocumentIssueComponent', () => {
  let component: DailyDocumentIssueComponent;
  let fixture: ComponentFixture<DailyDocumentIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyDocumentIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDocumentIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
