import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningBalanceCurrentYearComponent } from './opening-balance-current-year.component';

describe('OpeningBalanceCurrentYearComponent', () => {
  let component: OpeningBalanceCurrentYearComponent;
  let fixture: ComponentFixture<OpeningBalanceCurrentYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningBalanceCurrentYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningBalanceCurrentYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
