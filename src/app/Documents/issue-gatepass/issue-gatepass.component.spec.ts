import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueGatepassComponent } from './issue-gatepass.component';

describe('IssueGatepassComponent', () => {
  let component: IssueGatepassComponent;
  let fixture: ComponentFixture<IssueGatepassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueGatepassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
