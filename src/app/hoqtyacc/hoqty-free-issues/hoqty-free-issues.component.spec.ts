import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyFreeIssuesComponent } from './hoqty-free-issues.component';

describe('HoqtyFreeIssuesComponent', () => {
  let component: HoqtyFreeIssuesComponent;
  let fixture: ComponentFixture<HoqtyFreeIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyFreeIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyFreeIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
