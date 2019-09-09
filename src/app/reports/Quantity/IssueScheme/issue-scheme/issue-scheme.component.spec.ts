import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueSchemeComponent } from './issue-scheme.component';

describe('IssueSchemeComponent', () => {
  let component: IssueSchemeComponent;
  let fixture: ComponentFixture<IssueSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
