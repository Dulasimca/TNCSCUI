import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyOtherIssuesComponent } from './hoqty-other-issues.component';

describe('HoqtyOtherIssuesComponent', () => {
  let component: HoqtyOtherIssuesComponent;
  let fixture: ComponentFixture<HoqtyOtherIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyOtherIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyOtherIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
