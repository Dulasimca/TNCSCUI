import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueSchemeCoOpComponent } from './issue-scheme-co-op.component';

describe('IssueSchemeCoOpComponent', () => {
  let component: IssueSchemeCoOpComponent;
  let fixture: ComponentFixture<IssueSchemeCoOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueSchemeCoOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueSchemeCoOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
