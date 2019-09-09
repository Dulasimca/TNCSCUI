import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTypeAbstractComponent } from './issue-type-abstract.component';

describe('IssueTypeAbstractComponent', () => {
  let component: IssueTypeAbstractComponent;
  let fixture: ComponentFixture<IssueTypeAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueTypeAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueTypeAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
