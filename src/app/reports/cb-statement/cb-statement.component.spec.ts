import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CBStatementComponent } from './cb-statement.component';

describe('CbStatementComponent', () => {
  let component: CBStatementComponent;
  let fixture: ComponentFixture<CBStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CBStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CBStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
