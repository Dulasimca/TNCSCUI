import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueRegisterComponent } from './stock-issue-register.component';

describe('StockIssueRegisterComponent', () => {
  let component: StockIssueRegisterComponent;
  let fixture: ComponentFixture<StockIssueRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockIssueRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockIssueRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
