import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningBalanceDetailsComponent } from './opening-balance-details.component';

describe('OpeningBalanceDetailsComponent', () => {
  let component: OpeningBalanceDetailsComponent;
  let fixture: ComponentFixture<OpeningBalanceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningBalanceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningBalanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
