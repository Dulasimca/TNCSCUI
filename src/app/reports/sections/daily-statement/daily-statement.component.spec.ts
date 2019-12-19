import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStatementComponent } from './daily-statement.component';

describe('DailyStatementComponent', () => {
  let component: DailyStatementComponent;
  let fixture: ComponentFixture<DailyStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
