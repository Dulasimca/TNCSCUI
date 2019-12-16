import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownEmployeeDetailsComponent } from './godown-employee-details.component';

describe('GodownEmployeeDetailsComponent', () => {
  let component: GodownEmployeeDetailsComponent;
  let fixture: ComponentFixture<GodownEmployeeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownEmployeeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownEmployeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
