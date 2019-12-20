import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStockStatementComponent } from './dailystockstatement.component';

describe('DailystockstatementComponent', () => {
  let component: DailyStockStatementComponent;
  let fixture: ComponentFixture<DailyStockStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyStockStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStockStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
