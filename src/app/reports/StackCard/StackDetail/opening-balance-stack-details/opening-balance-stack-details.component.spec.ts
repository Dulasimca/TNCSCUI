import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningBalanceStackDetailsComponent } from './opening-balance-stack-details.component';

describe('OpeningBalanceStackDetailsComponent', () => {
  let component: OpeningBalanceStackDetailsComponent;
  let fixture: ComponentFixture<OpeningBalanceStackDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningBalanceStackDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningBalanceStackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
