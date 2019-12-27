import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownDashboardComponent } from './godown-dashboard.component';

describe('GodownDashboardComponent', () => {
  let component: GodownDashboardComponent;
  let fixture: ComponentFixture<GodownDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
