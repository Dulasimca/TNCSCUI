import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueReceiptComponent } from './issue-receipt.component';

describe('IssueReceiptComponent', () => {
  let component: IssueReceiptComponent;
  let fixture: ComponentFixture<IssueReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
