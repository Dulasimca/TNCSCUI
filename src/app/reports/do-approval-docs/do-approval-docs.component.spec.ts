import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoApprovalDocsComponent } from './do-approval-docs.component';

describe('DoApprovalDocsComponent', () => {
  let component: DoApprovalDocsComponent;
  let fixture: ComponentFixture<DoApprovalDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoApprovalDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoApprovalDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
