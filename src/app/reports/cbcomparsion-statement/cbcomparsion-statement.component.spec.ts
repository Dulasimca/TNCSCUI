import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CBComparsionStatementComponent } from './cbcomparsion-statement.component';

describe('CBComparsionStatementComponent', () => {
  let component: CBComparsionStatementComponent;
  let fixture: ComponentFixture<CBComparsionStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CBComparsionStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CBComparsionStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
